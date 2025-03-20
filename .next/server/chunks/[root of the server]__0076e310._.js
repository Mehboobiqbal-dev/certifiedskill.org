module.exports = {

"[externals]/next/dist/compiled/next-server/pages-api.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/pdfkit [external] (pdfkit, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("pdfkit", () => require("pdfkit"));

module.exports = mod;
}}),
"[externals]/uuid [external] (uuid, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("uuid");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/mongoose [external] (mongoose, cjs)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}}),
"[project]/lib/db.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
// lib/db.js
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
if (!process.env.MONGO_URI) {
    throw new Error('Please define the MONGO_URI environment variable');
}
// Use a global variable to cache the connection in development.
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}
async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(process.env.MONGO_URI).then((mongoose)=>mongoose.connection);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
const __TURBOPACK__default__export__ = connectToDatabase;
}}),
"[project]/pages/api/certificates/index.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
// pages/api/certificates/index.js
__turbopack_context__.s({
    "default": (()=>handler)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$pdfkit__$5b$external$5d$__$28$pdfkit$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/pdfkit [external] (pdfkit, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$uuid__$5b$external$5d$__$28$uuid$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/uuid [external] (uuid, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.js [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$uuid__$5b$external$5d$__$28$uuid$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$uuid__$5b$external$5d$__$28$uuid$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
async function handler(req, res) {
    // Connect to the database for both GET and POST methods.
    let connection;
    try {
        connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"])();
    } catch (dbError) {
        console.error('Database connection error:', dbError);
        return res.status(500).json({
            message: 'Database connection failed'
        });
    }
    // Use the native Db instance. Replace 'myDatabase' with your database name if needed.
    // If your MONGO_URI already specifies a default DB, connection.db should exist.
    const db = connection.db || connection.useDb('myDatabase');
    // Alternatively, if you know your connection always has a DB, you can use:
    // const db = connection.db;
    if (req.method === 'GET') {
        // GET: List certificates for a user (query by userEmail or userId).
        const { userEmail, userId } = req.query;
        if (!userEmail && !userId) {
            return res.status(400).json({
                message: 'Please provide a userEmail or userId in the query string'
            });
        }
        const query = {};
        if (userEmail) query.userEmail = userEmail;
        if (userId) query.userId = userId;
        try {
            const certificates = await db.collection('certificates').find(query).toArray();
            console.log(`Found ${certificates.length} certificate(s) for query:`, query);
            return res.status(200).json(certificates);
        } catch (error) {
            console.error('Error fetching certificates:', error);
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    } else if (req.method === 'POST') {
        // POST: Generate a certificate PDF for a passed exam.
        // Expected Payload: { userId, userName, examId, examName, passed, [userEmail] }
        const { userId, userName, examId, examName, passed, userEmail } = req.body;
        // Allow a boolean true or string "true" to indicate a passing exam.
        if (passed !== true && passed !== 'true') {
            console.error('Exam not passed:', req.body);
            return res.status(400).json({
                message: 'User did not pass the exam'
            });
        }
        try {
            // Check if a certificate already exists for this user and exam.
            let certificate = await db.collection('certificates').findOne({
                userId,
                examId
            });
            if (certificate) {
                console.log('Existing certificate found:', certificate);
                // If certificate exists but is missing a certificateId, update it.
                if (!certificate.certificateId) {
                    certificate.certificateId = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$uuid__$5b$external$5d$__$28$uuid$2c$__esm_import$29$__["v4"])();
                    await db.collection('certificates').updateOne({
                        _id: certificate._id
                    }, {
                        $set: {
                            certificateId: certificate.certificateId
                        }
                    });
                    console.log('Updated certificate with new certificateId:', certificate.certificateId);
                }
            } else {
                // Create a new certificate record.
                certificate = {
                    userId,
                    userName,
                    examId,
                    examName,
                    certificateId: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$uuid__$5b$external$5d$__$28$uuid$2c$__esm_import$29$__["v4"])(),
                    issuedAt: new Date(),
                    ...userEmail && {
                        userEmail
                    }
                };
                await db.collection('certificates').insertOne(certificate);
                console.log('Created new certificate:', certificate);
            }
            // Set headers to render the PDF inline.
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="certificate.pdf"');
            // Create a new PDF document with a landscape layout.
            const doc = new __TURBOPACK__imported__module__$5b$externals$5d2f$pdfkit__$5b$external$5d$__$28$pdfkit$2c$__cjs$29$__["default"]({
                size: 'A4',
                layout: 'landscape',
                margins: {
                    top: 50,
                    bottom: 50,
                    left: 50,
                    right: 50
                }
            });
            // Pipe the PDF document directly to the response.
            doc.pipe(res);
            // Get the page dimensions.
            const { width, height } = doc.page;
            // -------------------------------
            // Professional Certificate Design
            // -------------------------------
            // 1. Background & Border.
            doc.rect(0, 0, width, height).fill('#ffffff'); // White background.
            doc.rect(40, 40, width - 80, height - 80).lineWidth(2).stroke('#333333'); // Clean, modern border.
            // 2. Header: Brand Information.
            doc.fillColor('#333333').font('Helvetica-Bold').fontSize(20).text('CertifiedSkill.org', 0, 60, {
                align: 'center'
            });
            doc.font('Helvetica').fontSize(12).text('Your trusted partner in professional certifications', {
                align: 'center'
            });
            // 3. Certificate Title.
            doc.moveDown(2);
            doc.font('Helvetica-Bold').fontSize(36).text('Certificate of Achievement', {
                align: 'center',
                underline: true
            });
            // 4. Certificate Details.
            doc.moveDown(1.5);
            doc.font('Helvetica').fontSize(18).text('This certificate verifies that', {
                align: 'center'
            });
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').fontSize(28).text(userName, {
                align: 'center'
            });
            doc.moveDown(0.5);
            doc.font('Helvetica').fontSize(18).text('has successfully passed the exam:', {
                align: 'center'
            });
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').fontSize(24).text(examName, {
                align: 'center'
            });
            // 5. Authenticity Assurance Text.
            doc.moveDown(1.5);
            doc.font('Helvetica').fontSize(14).text('This is an authentic certificate digitally issued by CertifiedSkill.org.', {
                align: 'center'
            });
            doc.text('Visit CertifiedSkill.org.com to verify its authenticity.', {
                align: 'center'
            });
            // 6. Footer Details.
            const issuedOn = new Date(certificate.issuedAt).toLocaleDateString();
            doc.font('Helvetica').fontSize(10).text(`Certificate ID: ${certificate.certificateId}`, 50, height - 70, {
                align: 'left'
            });
            doc.font('Helvetica').fontSize(10).text(`Issued on: ${issuedOn}`, -50, height - 70, {
                align: 'right'
            });
            // 7. Signature Placeholder at the bottom-right.
            const signY = height - 100;
            const signX = width - 200;
            doc.moveTo(signX, signY).lineTo(signX + 100, signY).stroke('#333333');
            doc.font('Helvetica').fontSize(10).text('Authorized Signature', signX, signY + 5, {
                align: 'center',
                width: 100
            });
            // 8. Add GetCertify Stamp.
            const stampDiameter = 100;
            const stampX = 50; // Adjust as needed.
            const stampY = height - stampDiameter - 50; // Adjust as needed.
            doc.circle(stampX + stampDiameter / 2, stampY + stampDiameter / 2, stampDiameter / 2).lineWidth(2).stroke('#003366');
            doc.circle(stampX + stampDiameter / 2, stampY + stampDiameter / 2, stampDiameter / 2).fillOpacity(0.1).fill('#003366');
            doc.fillOpacity(1);
            doc.font('Helvetica-Bold').fontSize(14).fillColor('#003366').text('GetCertify', stampX, stampY + stampDiameter / 2 - 7, {
                width: stampDiameter,
                align: 'center'
            });
            // Finalize and end the PDF stream.
            doc.end();
            console.log('Certificate PDF generated successfully.');
        } catch (error) {
            console.error('Certificate generation error:', error);
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    } else {
        return res.status(405).json({
            message: 'Method Not Allowed'
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/node_modules/next/dist/esm/server/route-modules/pages-api/module.compiled.js [api] (ecmascript)": (function(__turbopack_context__) {

var { g: global, d: __dirname, m: module, e: exports } = __turbopack_context__;
{
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    if ("TURBOPACK compile-time truthy", 1) {
        module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/pages-api.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api.runtime.dev.js, cjs)");
    } else {
        "TURBOPACK unreachable";
    }
} //# sourceMappingURL=module.compiled.js.map
}}),
"[project]/node_modules/next/dist/esm/server/route-kind.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "RouteKind": (()=>RouteKind)
});
var RouteKind = /*#__PURE__*/ function(RouteKind) {
    /**
   * `PAGES` represents all the React pages that are under `pages/`.
   */ RouteKind["PAGES"] = "PAGES";
    /**
   * `PAGES_API` represents all the API routes under `pages/api/`.
   */ RouteKind["PAGES_API"] = "PAGES_API";
    /**
   * `APP_PAGE` represents all the React pages that are under `app/` with the
   * filename of `page.{j,t}s{,x}`.
   */ RouteKind["APP_PAGE"] = "APP_PAGE";
    /**
   * `APP_ROUTE` represents all the API routes and metadata routes that are under `app/` with the
   * filename of `route.{j,t}s{,x}`.
   */ RouteKind["APP_ROUTE"] = "APP_ROUTE";
    /**
   * `IMAGE` represents all the images that are generated by `next/image`.
   */ RouteKind["IMAGE"] = "IMAGE";
    return RouteKind;
}({}); //# sourceMappingURL=route-kind.js.map
}}),
"[project]/node_modules/next/dist/esm/build/templates/helpers.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname } = __turbopack_context__;
{
/**
 * Hoists a name from a module or promised module.
 *
 * @param module the module to hoist the name from
 * @param name the name to hoist
 * @returns the value on the module (or promised module)
 */ __turbopack_context__.s({
    "hoist": (()=>hoist)
});
function hoist(module, name) {
    // If the name is available in the module, return it.
    if (name in module) {
        return module[name];
    }
    // If a property called `then` exists, assume it's a promise and
    // return a promise that resolves to the name.
    if ('then' in module && typeof module.then === 'function') {
        return module.then((mod)=>hoist(mod, name));
    }
    // If we're trying to hoise the default export, and the module is a function,
    // return the module itself.
    if (typeof module === 'function' && name === 'default') {
        return module;
    }
    // Otherwise, return undefined.
    return undefined;
} //# sourceMappingURL=helpers.js.map
}}),
"[project]/node_modules/next/dist/esm/build/templates/pages-api.js { INNER_PAGE => \"[project]/pages/api/certificates/index.js [api] (ecmascript)\" } [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, d: __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "config": (()=>config),
    "default": (()=>__TURBOPACK__default__export__),
    "routeModule": (()=>routeModule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/route-modules/pages-api/module.compiled.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/route-kind.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/build/templates/helpers.js [api] (ecmascript)");
// Import the userland code.
var __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$certificates$2f$index$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/pages/api/certificates/index.js [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$certificates$2f$index$2e$js__$5b$api$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$certificates$2f$index$2e$js__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$certificates$2f$index$2e$js__$5b$api$5d$__$28$ecmascript$29$__, 'default');
const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$certificates$2f$index$2e$js__$5b$api$5d$__$28$ecmascript$29$__, 'config');
const routeModule = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__["PagesAPIRouteModule"]({
    definition: {
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__["RouteKind"].PAGES_API,
        page: "/api/certificates/index",
        pathname: "/api/certificates",
        // The following aren't used in production.
        bundlePath: '',
        filename: ''
    },
    userland: __TURBOPACK__imported__module__$5b$project$5d2f$pages$2f$api$2f$certificates$2f$index$2e$js__$5b$api$5d$__$28$ecmascript$29$__
}); //# sourceMappingURL=pages-api.js.map
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__0076e310._.js.map