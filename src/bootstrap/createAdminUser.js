'use strict'

module.exports = async strapi => {
  const adminUsers = await strapi.query('admin::user').findMany()

  if (adminUsers.length === 0) {
    const adminPassword = process.env.ADMIN_PW
    if (!adminPassword) {
      console.error('ADMIN_PW environment variable is not set. Skipping admin user creation.')
      return
    }

    try {
      await strapi.admin.services.role.createRolesIfNoneExist()
      const superAdminRole = await strapi.db.query('admin::role').findOne({
        where: { code: 'strapi-super-admin' },
      })

      await strapi.admin.services.user.create({
        firstname: 'Julian',
        lastname: 'Admin',
        email: 'juliantosun@gmail.com',
        password: adminPassword,
        isActive: true,
        roles: [superAdminRole.id],
      })
      console.log('Admin user created.')
    } catch (error) {
      console.error('Unable to create admin user:', error)
    }
  } else {
    console.log('Admin user already exists. Skipping creation.')
  }
}
