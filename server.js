require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');

const sequelize = require('./config/database');
const Marca = require('./models/Marca');   // para asegurar carga
const Vehiculo = require('./models/Vehiculo');

const authRoutes = require('./routes/auth');
const marcaRoutes = require('./routes/marcas');
const vehiculoRoutes = require('./routes/vehiculos');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Archivos estáticos y uploads (dev)
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});


// Rutas
app.use('/', authRoutes);
app.use('/marcas', marcaRoutes);
app.use('/vehiculos', vehiculoRoutes);

// Ruta pública para listar vehículos + marcas (home)
const VehiculoModel = require('./models/Vehiculo');
const MarcaModel = require('./models/Marca');
app.get('/', async (req, res) => {
  const vehiculos = await VehiculoModel.findAll({ include: [{ model: MarcaModel, as: 'marca' }] });
  res.render('index', { vehiculos, user: req.session.user });
});

// Iniciar DB y servidor
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a DB');
    // sync crea tablas si no existen. En producción usar migraciones.
    await sequelize.sync({ alter: true });
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
  } catch (err) {
    console.error('Error iniciando app:', err);
  }
})();
