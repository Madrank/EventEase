import Joi from 'joi';

export const createEventSchema = Joi.object({
  title: Joi.string().min(3).max(200).required().messages({
    'string.min': 'Le titre doit contenir au moins 3 caractères',
    'any.required': 'Le titre est requis',
  }),
  description: Joi.string().min(10).max(5000).required().messages({
    'string.min': 'La description doit contenir au moins 10 caractères',
    'any.required': 'La description est requise',
  }),
  category: Joi.string().optional(),
  date: Joi.date().iso().required().messages({
    'date.format': 'Format de date invalide (ISO requis)',
    'any.required': 'La date est requise',
  }),
  endDate: Joi.date().iso().min(Joi.ref('date')).optional().messages({
    'date.format': 'Format de date invalide (ISO requis)',
    'date.min': 'La date de fin doit être après la date de début',
  }),
  location: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  postalCode: Joi.string().optional(),
  country: Joi.string().optional(),
  capacity: Joi.number().integer().positive().optional(),
  budget: Joi.number().positive().optional(),
  image: Joi.string().uri().optional(),
  status: Joi.string().valid('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED').optional(),
});

export const updateEventSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  description: Joi.string().min(10).max(5000).optional(),
  category: Joi.string().optional(),
  date: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('date')).optional(),
  location: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  postalCode: Joi.string().optional(),
  country: Joi.string().optional(),
  capacity: Joi.number().integer().positive().optional(),
  budget: Joi.number().positive().optional(),
  image: Joi.string().uri().optional(),
  status: Joi.string().valid('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED').optional(),
});
