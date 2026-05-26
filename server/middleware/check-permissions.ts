// server/middleware/check-permissions.ts
export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  
  // Проверяем только защищенные пути
  if (!url.pathname.startsWith('/admin') && 
      !url.pathname.startsWith('/pvz') && 
      !url.pathname.startsWith('/driver')) {
    return
  }

  // Пропускаем API-запросы
  if (url.pathname.startsWith('/api/')) {
    return
  }

  try {
    // Получаем пользователя через тот же метод, что и в me.get.ts
    const accessToken = getCookie(event, 'access_token')
    
    if (!accessToken) {
      throw createError({ statusCode: 404, message: 'Страница не найдена' })
    }

    // Делаем запрос к Django за данными пользователя
    const userData = await $fetch('http://212.41.28.206/api/v1/auth/profile/', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    // Проверяем права доступа
    const permissions = userData.permissions
    
    if (url.pathname.startsWith('/admin') && !permissions?.can_access_admin_panel) {
      throw createError({ statusCode: 404, message: 'Страница не найдена' })
    }
    
    if (url.pathname.startsWith('/pvz') && !permissions?.can_access_pvz_panel) {
      throw createError({ statusCode: 404, message: 'Страница не найдена' })
    }
    
    if (url.pathname.startsWith('/driver') && !permissions?.can_access_driver_app) {
      throw createError({ statusCode: 404, message: 'Страница не найдена' })
    }

  } catch (error) {
    // Если это наша ошибка 404 — пробрасываем
    if (error.statusCode === 404) {
      throw error
    }
    
    // Любая другая ошибка (токен не валиден и т.д.) — тоже 404
    throw createError({ statusCode: 404, message: 'Страница не найдена' })
  }
})