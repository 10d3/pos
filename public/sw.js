if(!self.define){let e,s={};const t=(t,i)=>(t=new URL(t+".js",i).href,s[t]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=t,e.onload=s,document.head.appendChild(e)}else e=t,importScripts(t),s()})).then((()=>{let e=s[t];if(!e)throw new Error(`Module ${t} didn’t register its module`);return e})));self.define=(i,a)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let c={};const r=e=>t(e,n),o={module:{uri:n},exports:c,require:r};s[n]=Promise.all(i.map((e=>o[e]||r(e)))).then((e=>(a(...e),c)))}}define(["./workbox-92923e46"],(function(e){"use strict";importScripts("fallback-MS-HSSuARMhTxpgFPHHot.js"),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"05e9f1e0ce37d0d7ab7693639a3386ea"},{url:"/_next/static/MS-HSSuARMhTxpgFPHHot/_buildManifest.js",revision:"d8e76795389ab238a63919ec4b1d4fcd"},{url:"/_next/static/MS-HSSuARMhTxpgFPHHot/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/187-19a6687b94fb4f75.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/191-12728e6942a28fb7.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/201-78cce4e1345ac82a.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/25-a4a9d51f0744bdd6.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/30-f82a40da6b023dc6.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/341.83c7160615e02660.js",revision:"83c7160615e02660"},{url:"/_next/static/chunks/435-2d27832c664aedeb.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/472.2c08b965bd9148e2.js",revision:"2c08b965bd9148e2"},{url:"/_next/static/chunks/474-6f0dd00b6870c456.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/4bd1b696-1f4ae1eaa4e60f16.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/521-5e8361f54c807b57.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/684-70d0ab33376b5e31.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/698-1065f88610192c74.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/713-5743c9de4695cee2.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/72-8008a56691f24e96.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/725-434c0360f92c094d.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/874-73577adab6ca8bdb.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/919-8d1c8a696a20cb3e.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/97-86ba971c5c4d4019.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/(pos)/layout-dc0972c8d8d08114.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/(pos)/pos/customers/loyalty/page-b81eed5bd29f0547.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/(pos)/pos/customers/page-1dd64f1ee3d4179d.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/(pos)/pos/menu/new/page-d25f195b9d975478.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/(pos)/pos/menu/page-46dc2336f6d6cbe0.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/(pos)/pos/orders/%5Bid%5D/page-8da649afd0ee177e.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/(pos)/pos/orders/page-635148cd8d8ed281.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/(pos)/pos/page-b13ac73dd6effdb8.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/(pos)/pos/reports/inventory/page-ba044c33603aeac9.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/(pos)/pos/reports/sales/page-071428fbebc2f666.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/(pos)/pos/reports/staff/page-c2d895085b85a511.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/_not-found/page-632b44b9af23891b.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/api/auth/login/route-10499d88d2bcedf9.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/api/auth/me/route-b76c355b357b9a31.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/api/auth/signup/route-1b16e2196ce44c32.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/api/customers/route-26905b69d14c98c2.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/api/health-check/route-89fd8f077d7c1944.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/api/orders/route-f4375ffa014c8d81.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/api/print/route-57c72248f28001ea.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/layout-b13c9c58c8a7c290.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/app/page-d0400ab075c8bdec.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/framework-66dcb5289ae9d888.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/main-4b56ca5a5c99f68e.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/main-app-80be5d76ab760990.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/pages/_app-067aff0c5a380abb.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/pages/_error-5f0d3295ca580c08.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-60d0a85e14775266.js",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/_next/static/css/8991dc85871c01b2.css",revision:"8991dc85871c01b2"},{url:"/_next/static/media/569ce4b8f30dc480-s.p.woff2",revision:"ef6cefb32024deac234e82f932a95cbd"},{url:"/_next/static/media/747892c23ea88013-s.woff2",revision:"a0761690ccf4441ace5cec893b82d4ab"},{url:"/_next/static/media/93f479601ee12b01-s.p.woff2",revision:"da83d5f06d825c5ae65b7cca706cb312"},{url:"/_next/static/media/ba015fad6dcf6784-s.woff2",revision:"8ea4f719af3312a055caf09f34c89a77"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/icons/icon-192x192.png",revision:"c17ac8a20020b67446abff3ca4d56207"},{url:"/icons/icon-512x512.png",revision:"731d60ab73618598f11ae934c7952c4e"},{url:"/icons/maskable.png",revision:"c17ac8a20020b67446abff3ca4d56207"},{url:"/images/fallback.png",revision:"MS-HSSuARMhTxpgFPHHot"},{url:"/images/tsherles.jpeg",revision:"e266b2b9e96ac772e9bab32d5eb5fdf7"},{url:"/images/tsherles.png",revision:"108d09f062412970d25fca0f3b7a2905"},{url:"/images/tsherles52 .jpeg",revision:"baabd5725b397205ec80e3682ffd7a94"},{url:"/images/tsherles55 .jpeg",revision:"c84b00980d86930688b2284855fbea19"},{url:"/images/tsherles56 .jpeg",revision:"e298881d30d1e868e5b0a0e515415591"},{url:"/manifest.json",revision:"a32a7fc4677ea7edb55b8ca2e242574c"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/offline.html",revision:"02e3fe61c2b4e51b528315b62070a7de"},{url:"/screenshots/desktop.png",revision:"45ab07ea4f9e0a50f0f92e2583f50d92"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:t,state:i})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s},{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/^https?.*/,new e.NetworkFirst({cacheName:"offlineCache",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:200,maxAgeSeconds:2592e3}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET")}));
