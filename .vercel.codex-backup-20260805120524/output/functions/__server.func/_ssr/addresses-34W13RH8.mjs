import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./auth-D2-u71mo.mjs";
import { a as updateCustomerAddress, i as setDefaultAddress, n as getCustomerAddresses, r as saveCustomerAddress, t as deleteCustomerAddress } from "./addresses-BS_C9H_D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/addresses-34W13RH8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)(null);
function AddressProvider({ children }) {
	const { user } = useAuth();
	const [customerId, setCustomerId] = (0, import_react.useState)(null);
	const [addresses, setAddresses] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (user) setCustomerId(user.id);
		else {
			setCustomerId(null);
			setAddresses([]);
		}
	}, [user]);
	const refreshAddresses = (0, import_react.useCallback)(async () => {
		if (!customerId) return;
		setLoading(true);
		const data = await getCustomerAddresses(customerId);
		setAddresses(data);
		setLoading(false);
	}, [customerId]);
	(0, import_react.useEffect)(() => {
		if (customerId) refreshAddresses();
	}, [customerId, refreshAddresses]);
	const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0] || null;
	const addAddress = (0, import_react.useCallback)(async (params) => {
		const result = await saveCustomerAddress(params);
		if (result) await refreshAddresses();
		return result;
	}, [refreshAddresses]);
	const editAddress = (0, import_react.useCallback)(async (id, params) => {
		const result = await updateCustomerAddress(id, params);
		if (result) await refreshAddresses();
		return result;
	}, [refreshAddresses]);
	const removeAddress = (0, import_react.useCallback)(async (id) => {
		const ok = await deleteCustomerAddress(id);
		if (ok) await refreshAddresses();
		return ok;
	}, [refreshAddresses]);
	const markDefault = (0, import_react.useCallback)(async (id) => {
		if (!customerId) return false;
		const ok = await setDefaultAddress(id, customerId);
		if (ok) await refreshAddresses();
		return ok;
	}, [customerId, refreshAddresses]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			addresses,
			loading,
			defaultAddress,
			refreshAddresses,
			addAddress,
			editAddress,
			removeAddress,
			markDefault
		},
		children
	});
}
function useAddresses() {
	const ctx = (0, import_react.useContext)(Ctx);
	if (!ctx) throw new Error("useAddresses must be used inside <AddressProvider>");
	return ctx;
}
//#endregion
export { useAddresses as n, AddressProvider as t };
