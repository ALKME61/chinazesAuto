// server/api/auth/login.post.ts
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    
    try {
        const response = await $fetch<{ access: string; refresh: string; user: any; error: any }>(
            'http://212.41.28.206/api/v1/auth/token/',
            {
                method: "POST",
                body: {
                    email: body.email,
                    password: body.password
                }
            }
        )

        // Удаляем старые куки
        deleteCookie(event, 'access_token')
        deleteCookie(event, 'refresh_token')

        setCookie(event, 'access_token', response.access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60,
            path: '/',
        })

        setCookie(event, 'refresh_token', response.refresh, {  
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/api/auth'
        }) 

        return { user: response.user }
        
    } catch (e) {
        console.log(e)
        return e
    }
})