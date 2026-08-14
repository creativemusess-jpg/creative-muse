//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-DVv8IIjM.js
var manifest = {
	"07405c69bbcb79a26f864ea775fb157a74deaa850851f655d944b5805a1213d6": {
		functionName: "previewTransactionalEmail_createServerFn_handler",
		importer: () => import("./_ssr/server-Djoj3sfu.mjs")
	},
	"52f38a3bd794cfc2e50e966b15d6b3d19de6c410bbcd2063c27bfc0b72dc3b2e": {
		functionName: "sendTransactionalEmail_createServerFn_handler",
		importer: () => import("./_ssr/server-Djoj3sfu.mjs")
	},
	"7e0644bcc6d0c61725ba0bc8b4cafd2eee084a80c1a68a71845501112970a76b": {
		functionName: "getEmailTestingConfig_createServerFn_handler",
		importer: () => import("./_ssr/server-Djoj3sfu.mjs")
	},
	"a4e8a2bff99be592783d09c561ddad54456e037f34dad45807685a4f47a77d63": {
		functionName: "listOrderNotifications_createServerFn_handler",
		importer: () => import("./_ssr/server-Djoj3sfu.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
