'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const _ = require('lodash');

module.exports = {

  async findOne(ctx) {
    const slug = ctx.query.slug;
    const language = ctx.query.language;
    const results = await strapi.query('jobs').find();  
    if (results) {
      const slugExists = results[0].jobs.find((result) => result.slug === slug);
      if (!slugExists) return [];
      const privacyConsent = results[0].job_privacy_consent.find((pc) => pc.language.short_name === language);
      if (!privacyConsent) return [];
      const translate = slugExists.job_translate.find(translate => translate.language.short_name === language);
      if (!translate) return []
      return {
        privacyConsent,
        translate
      };
    }
    return [];
  },
  async findAll(ctx) {
    const language = ctx.query.language;
    const results = await strapi.query('jobs').find();  
    if (results) {
      if (results[0].jobs.length > 0) {
        const jobs = results[0].jobs.filter((job) =>{
          let exists = false;
          job.job_translate.map((translate) => {
            if (translate.language.short_name === language) exists = true;
          })
          if (exists) return job;
        });
        if (jobs.length > 0) {
          return jobs;
        }
      }
    }
    return [];
  },
};
