const CHUNK_PUBLIC_PATH = "server/pages/sitemap.xml.js";
const runtime = require("../chunks/ssr/[turbopack]_runtime.js");
runtime.loadChunk("server/chunks/ssr/node_modules_35a4a14a._.js");
runtime.loadChunk("server/chunks/ssr/[root of the server]__b82be788._.js");
runtime.getOrInstantiateRuntimeModule("[project]/node_modules/next/dist/esm/build/templates/pages.js { INNER_PAGE => \"[project]/pages/sitemap.xml.js [ssr] (ecmascript)\", INNER_DOCUMENT => \"[project]/pages/_document.js [ssr] (ecmascript)\", INNER_APP => \"[project]/pages/_app.jsx [ssr] (ecmascript)\" } [ssr] (ecmascript)", CHUNK_PUBLIC_PATH);
module.exports = runtime.getOrInstantiateRuntimeModule("[project]/node_modules/next/dist/esm/build/templates/pages.js { INNER_PAGE => \"[project]/pages/sitemap.xml.js [ssr] (ecmascript)\", INNER_DOCUMENT => \"[project]/pages/_document.js [ssr] (ecmascript)\", INNER_APP => \"[project]/pages/_app.jsx [ssr] (ecmascript)\" } [ssr] (ecmascript)", CHUNK_PUBLIC_PATH).exports;
