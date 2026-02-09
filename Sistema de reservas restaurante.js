const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase (opcional): si están definidas las variables, usamos la base de datos
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = SUPABASE_URL && SUPABASE_SERVICE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    : null;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// En Vercel no se ejecuta start(); cargar datos en la primera petición
let dataLoaded = false;
let dataLoadPromise = null;
app.use((req, res, next) => {
    if (dataLoaded || !supabase) return next();
    if (!dataLoadPromise) dataLoadPromise = loadFromSupabase().then(() => { dataLoaded = true; });
    dataLoadPromise.then(() => next()).catch(() => next());
});

// Estado en memoria (caché cuando usamos Supabase)
let restaurantConfig = {
    openingTime: '12:00',
    closingTime: '23:00',
    lunchStart: '12:00',
    lunchEnd: '16:00',
    dinnerStart: '19:00',
    dinnerEnd: '23:00',
    operatingDays: [1, 2, 3, 4, 5, 6, 0],
    timeSlotInterval: 30,
    totalTables: 20,
    totalCapacity: 80,
    tables: generateInitialTables(20)
};

let reservations = [];

function generateInitialTables(count) {
    const tables = [];
    for (let i = 1; i <= count; i++) {
        tables.push({
            id: i,
            number: i,
            capacity: i <= 8 ? 2 : (i <= 14 ? 4 : (i <= 18 ? 6 : 8)),
            status: 'available'
        });
    }
    return tables;
}

// ---------- Supabase: cargar y guardar ----------
async function loadFromSupabase() {
    if (!supabase) return;
    try {
        const { data: configRow, error: configErr } = await supabase
            .from('restaurant_config')
            .select('*')
            .eq('id', 1)
            .single();
        if (configErr || !configRow) {
            console.log('⚠️ Supabase: no hay configuración, usando valores por defecto');
            return;
        }
        const { data: tablesRows } = await supabase.from('restaurant_tables').select('*').order('number');
        restaurantConfig = {
            openingTime: configRow.opening_time,
            closingTime: configRow.closing_time,
            lunchStart: configRow.lunch_start,
            lunchEnd: configRow.lunch_end,
            dinnerStart: configRow.dinner_start,
            dinnerEnd: configRow.dinner_end,
            operatingDays: configRow.operating_days || [1, 2, 3, 4, 5, 6, 0],
            timeSlotInterval: configRow.time_slot_interval || 30,
            totalTables: configRow.total_tables || 20,
            totalCapacity: configRow.total_capacity || 80,
            tables: (tablesRows || []).map(t => ({
                id: t.id,
                number: t.number,
                capacity: t.capacity,
                status: t.status || 'available'
            }))
        };
        const { data: resRows } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
        reservations = (resRows || []).map(r => ({
            id: r.id,
            name: r.name,
            phone: r.phone,
            email: r.email,
            guests: r.guests,
            date: r.date,
            time: r.time,
            status: r.status || 'pending',
            createdAt: r.created_at,
            assignedTables: r.assigned_tables || []
        }));
        console.log('✅ Datos cargados desde Supabase');
    } catch (err) {
        console.error('❌ Error cargando desde Supabase:', err.message);
    }
}

async function saveConfigToSupabase() {
    if (!supabase) return;
    try {
        await supabase.from('restaurant_config').update({
            opening_time: restaurantConfig.openingTime,
            closing_time: restaurantConfig.closingTime,
            lunch_start: restaurantConfig.lunchStart,
            lunch_end: restaurantConfig.lunchEnd,
            dinner_start: restaurantConfig.dinnerStart,
            dinner_end: restaurantConfig.dinnerEnd,
            operating_days: restaurantConfig.operatingDays,
            time_slot_interval: restaurantConfig.timeSlotInterval,
            total_tables: restaurantConfig.totalTables,
            total_capacity: restaurantConfig.totalCapacity,
            updated_at: new Date().toISOString()
        }).eq('id', 1);
        const currentIds = new Set(restaurantConfig.tables.map(t => t.id));
        const { data: existing } = await supabase.from('restaurant_tables').select('id');
        const existingIds = new Set((existing || []).map(r => r.id));
        for (const t of restaurantConfig.tables) {
            if (existingIds.has(t.id)) {
                await supabase.from('restaurant_tables').update({ number: t.number, capacity: t.capacity, status: t.status }).eq('id', t.id);
            } else {
                await supabase.from('restaurant_tables').insert({ number: t.number, capacity: t.capacity, status: t.status });
            }
        }
    } catch (err) {
        console.error('Error guardando config en Supabase:', err.message);
    }
}

// Cargar desde archivo (sin Supabase)
function loadData() {
    try {
        if (fs.existsSync('data.json')) {
            const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
            restaurantConfig = data.config || restaurantConfig;
            reservations = data.reservations || [];
            console.log('✅ Datos cargados desde archivo');
        }
    } catch (error) {
        console.log('⚠️ No se pudo cargar datos previos, usando configuración por defecto');
    }
}

function saveData() {
    try {
        fs.writeFileSync('data.json', JSON.stringify({
            config: restaurantConfig,
            reservations: reservations
        }, null, 2));
    } catch (error) {
        console.error('Error guardando datos:', error);
    }
}

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify email configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Error en configuración de email:', error);
    } else {
        console.log('✅ Servidor de email listo para enviar mensajes');
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Sistema de Reservas Restaurante.html'));
});

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'Panel de administración - Sistema de reservas.html'));
});

// ============================================
// ADMIN ENDPOINTS
// ============================================

// Get restaurant configuration
app.get('/api/admin/config', (req, res) => {
    res.json({ success: true, config: restaurantConfig });
});

// Update restaurant configuration
app.put('/api/admin/config', async (req, res) => {
    try {
        const { openingTime, closingTime, lunchStart, lunchEnd, dinnerStart, dinnerEnd, operatingDays, totalTables, totalCapacity } = req.body;
        
        restaurantConfig = {
            ...restaurantConfig,
            openingTime: openingTime || restaurantConfig.openingTime,
            closingTime: closingTime || restaurantConfig.closingTime,
            lunchStart: lunchStart || restaurantConfig.lunchStart,
            lunchEnd: lunchEnd || restaurantConfig.lunchEnd,
            dinnerStart: dinnerStart || restaurantConfig.dinnerStart,
            dinnerEnd: dinnerEnd || restaurantConfig.dinnerEnd,
            operatingDays: operatingDays || restaurantConfig.operatingDays,
            totalTables: totalTables || restaurantConfig.totalTables,
            totalCapacity: totalCapacity || restaurantConfig.totalCapacity
        };

        // Regenerate tables if count changed
        if (totalTables && totalTables !== restaurantConfig.tables.length) {
            restaurantConfig.tables = generateInitialTables(totalTables);
        }

        if (supabase) await saveConfigToSupabase(); else saveData();
        res.json({ success: true, config: restaurantConfig });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all reservations
app.get('/api/admin/reservations', (req, res) => {
    const { date } = req.query;
    let filteredReservations = reservations;
    
    if (date) {
        filteredReservations = reservations.filter(r => r.date === date);
    }
    
    res.json({ success: true, reservations: filteredReservations });
});

// Get available time slots based on configuration
app.get('/api/available-slots', (req, res) => {
    try {
        const { date } = req.query;
        
        if (!date) {
            return res.status(400).json({ success: false, message: 'Fecha requerida' });
        }

        // Check if day is operational
        const selectedDate = new Date(date + 'T00:00:00');
        const dayOfWeek = selectedDate.getDay();
        
        if (!restaurantConfig.operatingDays.includes(dayOfWeek)) {
            return res.json({ success: true, slots: [], message: 'Restaurante cerrado este día' });
        }

        // Generate time slots based on configuration
        const slots = generateTimeSlots(
            restaurantConfig.lunchStart,
            restaurantConfig.lunchEnd,
            restaurantConfig.dinnerStart,
            restaurantConfig.dinnerEnd,
            restaurantConfig.timeSlotInterval
        );

        // Check availability for each slot
        const dateReservations = reservations.filter(r => r.date === date);
        const availableSlots = slots.map(time => {
            const slotReservations = dateReservations.filter(r => r.time === time);
            const totalGuests = slotReservations.reduce((sum, r) => {
                return sum + (r.guests === '10+' ? 10 : parseInt(r.guests));
            }, 0);
            
            return {
                time,
                available: totalGuests < restaurantConfig.totalCapacity,
                remainingCapacity: Math.max(0, restaurantConfig.totalCapacity - totalGuests)
            };
        });

        res.json({ success: true, slots: availableSlots });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

function generateTimeSlots(lunchStart, lunchEnd, dinnerStart, dinnerEnd, interval = 30) {
    const slots = [];
    
    // Lunch slots
    let current = timeToMinutes(lunchStart);
    const lunchEndMin = timeToMinutes(lunchEnd);
    while (current <= lunchEndMin) {
        slots.push(minutesToTime(current));
        current += interval;
    }
    
    // Dinner slots
    current = timeToMinutes(dinnerStart);
    const dinnerEndMin = timeToMinutes(dinnerEnd);
    while (current <= dinnerEndMin) {
        slots.push(minutesToTime(current));
        current += interval;
    }
    
    return slots;
}

function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// Update reservation status
app.put('/api/admin/reservations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assignedTables } = req.body;
        
        const reservation = reservations.find(r => r.id === id);
        if (!reservation) {
            return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
        }
        
        if (status) reservation.status = status;
        if (assignedTables) reservation.assignedTables = assignedTables;
        
        if (supabase) {
            await supabase.from('reservations').update({
                status: reservation.status,
                assigned_tables: reservation.assignedTables
            }).eq('id', id);
        } else saveData();
        res.json({ success: true, reservation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete reservation
app.delete('/api/admin/reservations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const index = reservations.findIndex(r => r.id === id);
        
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
        }
        
        reservations.splice(index, 1);
        if (supabase) await supabase.from('reservations').delete().eq('id', id);
        else saveData();
        
        res.json({ success: true, message: 'Reserva eliminada' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get dashboard statistics
app.get('/api/admin/stats', (req, res) => {
    try {
        const { date } = req.query;
        const today = date || new Date().toISOString().split('T')[0];
        
        const todayReservations = reservations.filter(r => r.date === today);
        const totalGuestsToday = todayReservations.reduce((sum, r) => {
            return sum + (r.guests === '10+' ? 10 : parseInt(r.guests));
        }, 0);
        
        const largeGroups = todayReservations.filter(r => r.guests === '10+').length;
        const confirmedReservations = todayReservations.filter(r => r.status === 'confirmed').length;
        
        res.json({
            success: true,
            stats: {
                totalReservations: todayReservations.length,
                totalGuests: totalGuestsToday,
                remainingCapacity: Math.max(0, restaurantConfig.totalCapacity - totalGuestsToday),
                capacityUsed: Math.min(100, Math.round((totalGuestsToday / restaurantConfig.totalCapacity) * 100)),
                largeGroups,
                confirmedReservations,
                totalTables: restaurantConfig.totalTables
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// CLIENT ENDPOINTS
// ============================================

// API endpoint to send reservation email
app.post('/api/send-reservation', async (req, res) => {
    try {
        const { name, phone, email, guests, date, time } = req.body;

        // Validate required fields
        if (!name || !phone || !email || !guests || !date || !time) {
            return res.status(400).json({ 
                success: false, 
                message: 'Faltan campos obligatorios' 
            });
        }

        let reservation;
        if (supabase) {
            const { data: inserted, error } = await supabase.from('reservations').insert({
                name,
                phone,
                email,
                guests,
                date,
                time,
                status: 'pending',
                assigned_tables: []
            }).select('*').single();
            if (error) throw new Error(error.message);
            reservation = {
                id: inserted.id,
                name: inserted.name,
                phone: inserted.phone,
                email: inserted.email,
                guests: inserted.guests,
                date: inserted.date,
                time: inserted.time,
                status: inserted.status,
                createdAt: inserted.created_at,
                assignedTables: inserted.assigned_tables || []
            };
            reservations.push(reservation);
        } else {
            reservation = {
                id: Date.now().toString(),
                name,
                phone,
                email,
                guests,
                date,
                time,
                status: 'pending',
                createdAt: new Date().toISOString(),
                assignedTables: []
            };
            reservations.push(reservation);
            saveData();
        }

        // Format date
        const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Guest display text
        const guestText = guests === '10+' ? 
            'Grupo grande (10+ personas)' : 
            `${guests} ${guests == 1 ? 'persona' : 'personas'}`;

        // Email to restaurant
        const restaurantMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RESTAURANT_EMAIL,
            subject: `🍽️ Nueva Reserva - ${name}${guests === '10+' ? ' [GRUPO GRANDE]' : ''}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background: linear-gradient(135deg, #8B6F47, #D4A574);
                            color: white;
                            padding: 30px;
                            border-radius: 10px 10px 0 0;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .large-group-badge {
                            background: #ff6b6b;
                            color: white;
                            padding: 8px 16px;
                            border-radius: 20px;
                            display: inline-block;
                            margin-top: 10px;
                            font-weight: bold;
                        }
                        .content {
                            background: #f9f9f9;
                            padding: 30px;
                            border-radius: 0 0 10px 10px;
                        }
                        .info-box {
                            background: white;
                            border-left: 4px solid #D4A574;
                            padding: 15px;
                            margin: 15px 0;
                            border-radius: 5px;
                        }
                        .info-row {
                            display: flex;
                            justify-content: space-between;
                            padding: 10px 0;
                            border-bottom: 1px solid #eee;
                        }
                        .info-row:last-child {
                            border-bottom: none;
                        }
                        .label {
                            font-weight: bold;
                            color: #8B6F47;
                        }
                        .value {
                            color: #333;
                        }
                        .warning {
                            background: #fff3cd;
                            border-left: 4px solid #ffc107;
                            padding: 15px;
                            margin: 20px 0;
                            border-radius: 5px;
                        }
                        .warning strong {
                            color: #856404;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            color: #666;
                            font-size: 12px;
                        }
                        .admin-link {
                            background: #8B6F47;
                            color: white;
                            padding: 12px 24px;
                            text-decoration: none;
                            border-radius: 5px;
                            display: inline-block;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>🍽️ Nueva Reserva Recibida</h1>
                        ${guests === '10+' ? '<div class="large-group-badge">⚠️ GRUPO GRANDE (10+)</div>' : ''}
                    </div>
                    <div class="content">
                        <h2 style="color: #8B6F47; margin-top: 0;">Detalles de la Reserva</h2>
                        
                        <div class="info-box">
                            <div class="info-row">
                                <span class="label">📅 Fecha:</span>
                                <span class="value">${formattedDate}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">⏰ Hora:</span>
                                <span class="value">${time}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">👥 Comensales:</span>
                                <span class="value">${guestText}</span>
                            </div>
                        </div>

                        <h3 style="color: #8B6F47;">Datos del Cliente</h3>
                        <div class="info-box">
                            <div class="info-row">
                                <span class="label">👤 Nombre:</span>
                                <span class="value">${name}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">📞 Teléfono:</span>
                                <span class="value">${phone}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">📧 Email:</span>
                                <span class="value">${email}</span>
                            </div>
                        </div>

                        <div class="warning">
                            <strong>⚠️ Recordatorios:</strong>
                            <ul style="margin: 10px 0;">
                                <li>Cliente debe llegar 5 minutos antes de la hora reservada</li>
                                <li>Cambios o cancelaciones con 4 horas de antelación</li>
                                <li>Si llega más de 10 minutos tarde, la mesa puede cederse</li>
                            </ul>
                        </div>

                        <div style="text-align: center;">
                            <a href="${process.env.BASE_URL || 'http://localhost:3000'}/admin" class="admin-link">
                                Ver en Panel de Administración
                            </a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>Este correo fue generado automáticamente por el sistema de reservas</p>
                        <p>Fecha de envío: ${new Date().toLocaleString('es-ES')}</p>
                    </div>
                </body>
                </html>
            `
        };

        // Confirmation email to customer
        const customerMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `✅ Confirmación de Reserva - ${formattedDate} a las ${time}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background: linear-gradient(135deg, #8B6F47, #D4A574);
                            color: white;
                            padding: 30px;
                            border-radius: 10px 10px 0 0;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            background: #f9f9f9;
                            padding: 30px;
                            border-radius: 0 0 10px 10px;
                        }
                        .success-icon {
                            text-align: center;
                            font-size: 48px;
                            margin: 20px 0;
                        }
                        .info-box {
                            background: white;
                            border-left: 4px solid #5B8C5A;
                            padding: 15px;
                            margin: 15px 0;
                            border-radius: 5px;
                        }
                        .info-row {
                            display: flex;
                            justify-content: space-between;
                            padding: 10px 0;
                            border-bottom: 1px solid #eee;
                        }
                        .info-row:last-child {
                            border-bottom: none;
                        }
                        .label {
                            font-weight: bold;
                            color: #8B6F47;
                        }
                        .value {
                            color: #333;
                        }
                        .warning {
                            background: #fff3cd;
                            border-left: 4px solid #ffc107;
                            padding: 15px;
                            margin: 20px 0;
                            border-radius: 5px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            color: #666;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>¡Reserva Confirmada!</h1>
                    </div>
                    <div class="content">
                        <div class="success-icon">✅</div>
                        
                        <p>Hola <strong>${name}</strong>,</p>
                        <p>Tu reserva ha sido confirmada exitosamente. Esperamos verte pronto.</p>

                        <h3 style="color: #8B6F47;">Detalles de tu Reserva</h3>
                        <div class="info-box">
                            <div class="info-row">
                                <span class="label">📅 Fecha:</span>
                                <span class="value">${formattedDate}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">⏰ Hora:</span>
                                <span class="value">${time}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">👥 Comensales:</span>
                                <span class="value">${guestText}</span>
                            </div>
                        </div>

                        <div class="warning">
                            <strong>⚠️ Importante - Por favor lee:</strong>
                            <ul style="margin: 10px 0;">
                                <li><strong>Llega 5 minutos antes</strong> de la hora reservada</li>
                                <li>Para <strong>cambios o cancelaciones</strong>, avísanos con <strong>4 horas de antelación</strong></li>
                                <li>Si llegas <strong>más de 10 minutos tarde</strong>, la mesa podrá cederse a otros clientes</li>
                            </ul>
                        </div>

                        <p>¿Necesitas realizar algún cambio? Contáctanos:</p>
                        <p>📞 Teléfono: [TU TELÉFONO]<br>
                           📧 Email: ${process.env.RESTAURANT_EMAIL}</p>

                        <p style="margin-top: 30px; text-align: center; font-size: 18px;">
                            <strong>¡Te esperamos! 🍽️</strong>
                        </p>
                    </div>
                    <div class="footer">
                        <p>Gracias por elegirnos</p>
                    </div>
                </body>
                </html>
            `
        };

        // Send both emails
        await transporter.sendMail(restaurantMailOptions);
        await transporter.sendMail(customerMailOptions);

        console.log(`✅ Reserva confirmada: ${name} - ${formattedDate} ${time} - ID: ${reservation.id}`);

        res.json({ 
            success: true, 
            message: 'Reserva enviada correctamente',
            reservationId: reservation.id
        });

    } catch (error) {
        console.error('❌ Error al enviar emails:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al procesar la reserva',
            error: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Inicializar datos y arrancar servidor (solo cuando se ejecuta directamente, no en Vercel)
async function start() {
    if (supabase) {
        await loadFromSupabase();
        console.log('🗄️  Base de datos: Supabase');
    } else {
        loadData();
        console.log('🗄️  Base de datos: archivo data.json');
    }
    app.listen(PORT, () => {
        console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
        console.log(`📧 Email configurado: ${process.env.EMAIL_USER || '(no configurado)'}`);
        console.log(`🍽️  Email restaurante: ${process.env.RESTAURANT_EMAIL || '(no configurado)'}`);
    });
}

const isVercel = process.env.VERCEL === '1';
if (require.main === module && !isVercel) {
    start().catch(err => {
        console.error('Error al iniciar:', err);
        process.exit(1);
    });
}

module.exports = app;
