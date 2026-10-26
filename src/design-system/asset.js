/* Ruta pública de un recurso de public/, respetando la base del despliegue
   (por ejemplo /zion-vue/ en GitHub Pages). asset('assets/logo-white.svg') */
export const asset = (p) => import.meta.env.BASE_URL + p.replace(/^\//, '')
