'use strict';

/**
 * newsletter-box service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::newsletter-box.newsletter-box');
