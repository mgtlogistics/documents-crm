import Staff from "../models/Staff.js";
import RoleAssignment from "../models/RoleAssignment.js";
import Role from "../models/Role.js";
import Store from "../models/Store.js";
import Module from "../models/Module.js";
import { uploadLogo } from "../utils/public.utils.js";

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const REQUIRED_ADDRESS_FIELDS = [
  'street',
  'exteriorNumber',
  'neighborhood',
  'locality',
  'postalCode',
  'city',
  'state',
  'country',
];

const REQUIRED_PERSON_FIELDS = ['names', 'surnames', 'rfc'];

const REQUIRED_COMPANY_FIELDS = [
  'socialReason',
  'rfc',
  'legalRepresentativeName',
  'legalRepresentativeRfc',
  'legalRepresentativePosition',
  'formFillerName',
  'scripture',
  'notaryName',
  'notaryNumber',
  'notaryCity',
  'notaryState',
  'powerOfAttorneyNumber',
  'powerOfAttorneyVolume',
  'powerOfAttorneyDate',
];

const normalizeStringFields = (obj = {}) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
  );
};

const getMissingFields = (obj = {}, requiredFields = []) => {
  return requiredFields.filter((field) => {
    const value = obj[field];

    if (typeof value === 'string') {
      return value.trim().length === 0;
    }

    if (value instanceof Date) {
      return Number.isNaN(value.getTime());
    }

    return value === null || value === undefined;
  });
};

const inferPersonTypeByRoleNames = (roleNames = []) => {
  const normalizedNames = roleNames
    .filter((name) => typeof name === 'string')
    .map((name) => name.toLowerCase());

  if (normalizedNames.some((name) => name.includes('moral'))) {
    return 'company';
  }

  if (normalizedNames.some((name) => name.includes('fisica') || name.includes('física'))) {
    return 'person';
  }

  return null;
};

//Endpoint para subir imagenes aquí
router.post('/uploadLetterhead', (req, res) => {
  uploadLogo(req, res, async (error) => {
    try {
      if (error) {
        return res.status(400).json({
          message: 'No se pudo subir el logo',
          error: error.message,
        });
      }

      const userId = String(req.body?.userId || '').trim();

      if (!userId) {
        return res.status(400).json({
          message: 'El userId es requerido para subir el logo'
        });
      }

      const existingUser = await Staff.findById(userId);

      if (!existingUser) {
        return res.status(404).json({
          message: 'Usuario no encontrado'
        });
      }

      if (!req.file?.filename) {
        return res.status(400).json({
          message: 'Debes enviar un archivo en el campo logo'
        });
      }

      existingUser.letterhead = req.file.filename;
      await existingUser.save();

      return res.status(200).json({
        message: 'Logo subido exitosamente',
        letterhead: existingUser.letterhead,
      });
    } catch (uploadError) {
      console.error('Error en uploadLetterhead:', uploadError);
      return res.status(500).json({
        message: 'Error al subir el logo',
        error: uploadError.message,
      });
    }
  });
});

// Register - Registrar nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, profile, roleId, brandId, scope } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!username || !email || !password || !profile?.names) {
      return res.status(400).json({
        message: 'Username, email, password y nombres son requeridos'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await Staff.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'El usuario o email ya existe'
      });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = new Staff({
      username,
      email,
      password: hashedPassword,
      profile: {
        names: profile.names,
        lastNames: profile.lastNames || '',
        phone: profile.phone || ''
      }
    });

    await newUser.save();

    // Si se proporciona un roleId y brandId, asignar el rol
    if (roleId && brandId) {
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(400).json({
          message: 'El rol especificado no existe'
        });
      }

      // Validar que el rol pertenezca a la marca
      if (role.brandId !== brandId) {
        return res.status(400).json({
          message: 'El rol no pertenece a la marca especificada'
        });
      }

      // Validar scope
      const roleScope = scope || { type: 'brand' };
      
      if (roleScope.type === 'store') {
        if (!roleScope.targetId) {
          return res.status(400).json({
            message: 'Debe especificar el ID de la tienda para scope de tipo store'
          });
        }

        // Verificar que la tienda exista y pertenezca a la marca
        const store = await Store.findById(roleScope.targetId);
        if (!store || store.brandId !== brandId) {
          return res.status(400).json({
            message: 'La tienda no existe o no pertenece a la marca'
          });
        }
      }

      const roleAssignment = new RoleAssignment({
        userId: newUser._id,
        roleId: roleId,
        brandId: brandId,
        scope: roleScope
      });
      await roleAssignment.save();
    }

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      userId: newUser._id
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
});

// Endpoint para actualizar el perfil del usuario aquí
router.put('/updateProfile', async (req, res) => {
  try {
    const { userId, address, person, company, roleType } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: 'El userId es requerido'
      });
    }

    const existingUser = await Staff.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    const assignments = await RoleAssignment.find({ userId }).populate('roleId', 'name').lean();
    const roleNames = assignments
      .map((assignment) => assignment?.roleId?.name)
      .filter((name) => typeof name === 'string');

    const inferredTypeFromRole = inferPersonTypeByRoleNames(roleNames);
    const normalizedRoleType = typeof roleType === 'string' ? roleType.toLowerCase().trim() : '';

    let resolvedUserType = inferredTypeFromRole;

    if (!resolvedUserType && (normalizedRoleType === 'person' || normalizedRoleType === 'company')) {
      resolvedUserType = normalizedRoleType;
    }

    if (!resolvedUserType) {
      return res.status(400).json({
        message: 'No se pudo determinar el tipo de usuario (Persona Física o Persona Moral) a partir del rol',
        roleNames,
      });
    }

    if (person && company) {
      return res.status(400).json({
        message: 'Solo debe enviarse un tipo de perfil: person o company'
      });
    }

    const normalizedAddress = normalizeStringFields(address || {});
    const missingAddressFields = getMissingFields(normalizedAddress, REQUIRED_ADDRESS_FIELDS);

    if (missingAddressFields.length > 0) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios en address',
        missingFields: missingAddressFields.map((field) => `address.${field}`),
      });
    }

    const updatePayload = {
      address: normalizedAddress,
    };

    const unsetPayload = {};

    if (resolvedUserType === 'person') {
      const normalizedPerson = normalizeStringFields(person || {});
      const missingPersonFields = getMissingFields(normalizedPerson, REQUIRED_PERSON_FIELDS);

      if (missingPersonFields.length > 0) {
        return res.status(400).json({
          message: 'Faltan campos obligatorios para Persona Física',
          missingFields: missingPersonFields.map((field) => `person.${field}`),
        });
      }

      updatePayload.person = normalizedPerson;
      unsetPayload.company = 1;
    }

    if (resolvedUserType === 'company') {
      const normalizedCompany = normalizeStringFields(company || {});
      const missingCompanyFields = getMissingFields(normalizedCompany, REQUIRED_COMPANY_FIELDS);

      if (missingCompanyFields.length > 0) {
        return res.status(400).json({
          message: 'Faltan campos obligatorios para Persona Moral',
          missingFields: missingCompanyFields.map((field) => `company.${field}`),
        });
      }

      updatePayload.company = normalizedCompany;
      unsetPayload.person = 1;
    }

    updatePayload.isProfileComplete = true;

    const updatedUser = await Staff.findByIdAndUpdate(
      userId,
      {
        $set: updatePayload,
        $unset: unsetPayload,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    return res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser,
      roleType: resolvedUserType,
      isProfileComplete: true,
    });
  } catch (error) {
    console.error('Error en updateProfile:', error);
    return res.status(500).json({
      message: 'Error al actualizar el perfil del usuario',
      error: error.message,
    });
  }
});

// Login - Iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar campos
    if (!username || !password) {
      return res.status(400).json({
        message: 'Usuario y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const user = await Staff.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!user.status) {
      return res.status(403).json({
        message: 'Usuario inactivo'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Credenciales inválidas'
      });
    }

    // 2. Buscar todas sus asignaciones de roles y traer datos de Roles y Tiendas
    const assignments = await RoleAssignment.find({ userId: user._id }).populate('roleId');

    if (!assignments.length) {
      return res.status(403).json({
        message: 'El usuario no tiene roles asignados'
      });
    }

    const roleNames = assignments
      .map((assignment) => assignment?.roleId?.name)
      .filter((name) => typeof name === 'string');

    const roleType = inferPersonTypeByRoleNames(roleNames);
    const primaryRole = assignments[0]?.roleId;
    // 3. Procesar el "Scope"
    // Determinamos si es nivel Marca (Dueño) o nivel Tienda (Cajero/Gerente)
    const isBrandAdmin = assignments.some(a => a.scope.type === 'brand');
    const brandId = assignments[0]?.brandId;

    let accessibleStores = [];

    if (isBrandAdmin) {
      // Si es admin de marca, buscamos TODAS las tiendas de esa marca
      accessibleStores = await Store.find({ brandId });
    } else {
      // Si es de tienda, extraemos los IDs de las tiendas asignadas
      const storeIds = assignments.map(a => a.scope.targetId);
      accessibleStores = await Store.find({ _id: { $in: storeIds } });
    }


    // 4. Consolidar permisos únicos de todos sus roles
    const allPermissions = [...new Set(assignments.flatMap(a => a.roleId?.permissions || []))];

    let modules = await Module.find()
      .populate('pageId', 'name')
      .lean();

    const moduleDiagnostics = modules.map((module) => ({
      moduleId: module._id,
      type: module.type,
      pageId: module.pageId?._id ?? module.pageId ?? null,
      pageName: module.pageId?.name ?? null,
    }));

    const invalidModules = moduleDiagnostics.filter((module) => !module.pageId || !module.pageName);

    if (invalidModules.length > 0) {
      console.error('Login fallo por configuracion invalida de modulos', {
        totalModules: modules.length,
        invalidCount: invalidModules.length,
        invalidModules,
        moduleDiagnostics,
      });

      return res.status(500).json({
        message: 'Configuracion invalida de modulos',
        error: 'Hay modulos sin pagina asociada o con una referencia pageId invalida',
        details: invalidModules.map((module) => ({
          moduleId: module._id,
          pageId: module.pageId ?? null,
          type: module.type,
        })),
      });
    }

    modules = moduleDiagnostics.map((module) => ({
      _id: module.moduleId,
      page: module.pageName,
      type: module.type,
    }));

    // Generar token JWT
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        profile: user.profile,
      },
      process.env.jwtSecret,
      { expiresIn: '120d' }
    );

    res.status(200).json({
      message: 'Login exitoso',
      token,
      modules,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        isProfileComplete: user.isProfileComplete,
      },
      role: {
        id: primaryRole?._id ?? null,
        name: primaryRole?.name ?? null,
        type: roleType,
      },
      access: {
        brandId: brandId,
        level: isBrandAdmin ? 'brand' : 'store',
        permissions: allPermissions,
        stores: accessibleStores.map(s => ({ id: s._id, name: s.name }))
      },
    });

  } catch (error) {
    console.error('Error en login:', {
      message: error.message,
      stack: error.stack,
    });

    if (error?.message?.includes('pageId') || error?.message?.includes('name')) {
      return res.status(500).json({
        message: 'Error de configuracion en los modulos',
        error: 'Se detecto un modulo con pageId inexistente o sin datos de pagina al construir la sesion',
      });
    }

    res.status(500).json({
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
});

// GetAll - Obtener todos los usuarios
router.get('/getAll', async (req, res) => {
  try {
    const users = await Staff.find().select('-password');

    // Obtener roles para cada usuario
    const usersWithRoles = await Promise.all(
      users.map(async (user) => {
        const roleAssignments = await RoleAssignment.find({ userId: user._id });
        const roleIds = roleAssignments.map(ra => ra.roleId);
        const roles = await Role.find({ _id: { $in: roleIds } });

        return {
          ...user.toObject(),
          role: roles.map(r => ({ id: r._id, name: r.name }))[0]?.name || 'Sin rol'
        };
      })
    );

    res.status(200).json({
      message: 'Usuarios obtenidos exitosamente',
      count: usersWithRoles.length,
      users: usersWithRoles
    });

  } catch (error) {
    console.error('Error en getAll:', error);
    res.status(500).json({
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

router.get('/getById/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: 'userId es requerido',
      });
    }

    const user = await Staff.findById(userId).select('-password').lean();

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
      });
    }

    return res.status(200).json({
      message: 'Usuario obtenido exitosamente',
      user,
    });
  } catch (error) {
    console.error('Error en getById:', error);
    return res.status(500).json({
      message: 'Error al obtener usuario por id',
      error: error.message,
    });
  }
});

// GetByBrand - Obtener todo el staff de una marca
router.get('/brand/:brandId', async (req, res) => {
  try {
    const { brandId } = req.params;

    // Buscar todas las asignaciones de roles para esta marca
    const roleAssignments = await RoleAssignment.find({ brandId }).populate('roleId');

    // Obtener IDs únicos de usuarios
    const userIds = [...new Set(roleAssignments.map(ra => ra.userId))];

    // Buscar usuarios
    const users = await Staff.find({ _id: { $in: userIds } }).select('-password');

    // Enriquecer con información de roles y scope
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const userAssignments = roleAssignments.filter(ra => ra.userId === user._id);
        
        return {
          ...user.toObject(),
          assignments: userAssignments.map(ra => ({
            roleId: ra.roleId._id,
            roleName: ra.roleId.name,
            scope: ra.scope,
            scopeLevel: ra.scope.type === 'brand' ? 'Toda la marca' : 'Tienda específica'
          }))
        };
      })
    );

    res.status(200).json({
      message: 'Staff de la marca obtenido exitosamente',
      brandId: brandId,
      count: usersWithDetails.length,
      users: usersWithDetails
    });

  } catch (error) {
    console.error('Error en getByBrand:', error);
    res.status(500).json({
      message: 'Error al obtener staff de la marca',
      error: error.message
    });
  }
});

// GetByStore - Obtener staff de una tienda específica
router.get('/store/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;

    // Buscar la tienda para obtener su brandId
    const store = await Store.findById(storeId);
    
    if (!store) {
      return res.status(404).json({
        message: 'Tienda no encontrada'
      });
    }

    // Buscar asignaciones de roles que tengan:
    // 1. Scope de tipo 'brand' con el brandId de esta tienda (acceso a todas las tiendas)
    // 2. Scope de tipo 'store' con targetId igual a esta tienda
    const roleAssignments = await RoleAssignment.find({
      brandId: store.brandId,
      $or: [
        { 'scope.type': 'brand' },
        { 'scope.type': 'store', 'scope.targetId': storeId }
      ]
    }).populate('roleId');

    // Obtener IDs únicos de usuarios
    const userIds = [...new Set(roleAssignments.map(ra => ra.userId))];

    // Buscar usuarios
    const users = await Staff.find({ _id: { $in: userIds } }).select('-password');

    // Enriquecer con información de roles y scope
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const userAssignments = roleAssignments.filter(ra => ra.userId === user._id);
        
        return {
          ...user.toObject(),
          assignments: userAssignments.map(ra => ({
            roleId: ra.roleId._id,
            roleName: ra.roleId.name,
            scope: ra.scope,
            accessLevel: ra.scope.type === 'brand' ? 'Admin de marca' : 'Personal de tienda'
          }))
        };
      })
    );

    res.status(200).json({
      message: 'Staff de la tienda obtenido exitosamente',
      storeId: storeId,
      storeName: store.name,
      brandId: store.brandId,
      count: usersWithDetails.length,
      users: usersWithDetails
    });

  } catch (error) {
    console.error('Error en getByStore:', error);
    res.status(500).json({
      message: 'Error al obtener staff de la tienda',
      error: error.message
    });
  }
});


router.post('/changePassword', async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    // Validar campos
    if (!userId || !newPassword) {
      return res.status(400).json({
        message: 'Todos los campos son requeridos'
      });
    }

    // Validar longitud de la nueva contraseña
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    // Buscar usuario
    const user = await Staff.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si el usuario está activo
    if (!user.status) {
      return res.status(403).json({
        message: 'Usuario inactivo'
      });
    }



    // Verificar que la nueva contraseña sea diferente
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: 'La nueva contraseña debe ser diferente a la actual'
      });
    }

    // Hashear la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error en changePassword:', error);
    res.status(500).json({
      message: 'Error al cambiar contraseña',
      error: error.message
    });
  }
});


//Endpoint get by role
router.get('/by-role/:roleId', async (req, res) => {
  try {
    
    const rawRoleParam = String(req.params.roleId || '').trim();
    if (!rawRoleParam) {
      return res.status(400).json({
        message: 'roleId es requerido'
      });
    }
    console.log(rawRoleParam)

    const roleAssignments = await RoleAssignment.find({ roleId: rawRoleParam })
      .select('userId')
      .lean();

    const userIds = [...new Set(roleAssignments.map((assignment) => String(assignment.userId)))];

    if (userIds.length === 0) {
      return res.status(200).json([]);
    }

    const users = await Staff.find({ _id: { $in: userIds }, status: true })
      .select('_id username email profile')
      .sort({ 'profile.names': 1, 'profile.lastNames': 1 })
      .lean();

    return res.status(200).json(
      users.map((user) => ({
        _id: user._id,
        label: `${user.profile?.names || ''} ${user.profile?.lastNames || ''}`.trim() || user.username,
        subtitle: user.email || user.username,
      }))
    );
  } catch (error) {
    console.error('Error en by-role:', error);
    return res.status(500).json({
      message: 'Error al obtener usuarios por rol',
      error: error.message,
    });
  }
});

export const routeConfig = { path: "/v1/staff", router }