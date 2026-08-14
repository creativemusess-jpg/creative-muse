import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-DVv8IIjM.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-DlvYJMt6.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getEmailTestingConfig = createServerFn({ method: "GET" }).handler(createSsrRpc("7e0644bcc6d0c61725ba0bc8b4cafd2eee084a80c1a68a71845501112970a76b"));
var previewTransactionalEmail = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("07405c69bbcb79a26f864ea775fb157a74deaa850851f655d944b5805a1213d6"));
var sendTransactionalEmail = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("52f38a3bd794cfc2e50e966b15d6b3d19de6c410bbcd2063c27bfc0b72dc3b2e"));
var listOrderNotifications = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("a4e8a2bff99be592783d09c561ddad54456e037f34dad45807685a4f47a77d63"));
//#endregion
export { sendTransactionalEmail as i, listOrderNotifications as n, previewTransactionalEmail as r, getEmailTestingConfig as t };
