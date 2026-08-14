import { t as storefrontSupabase } from "./supabase-storefront-B2iEpuwU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/addresses-BS_C9H_D.js
var db = () => storefrontSupabase;
function rowToAddress(row) {
	return {
		id: row.id,
		customerId: row.customer_id,
		fullName: row.full_name || "",
		phone: row.phone || "",
		email: row.email || "",
		addressLine1: row.address_line1,
		addressLine2: row.address_line2 || "",
		city: row.city,
		state: row.state,
		postalCode: row.postal_code,
		landmark: row.landmark || "",
		addressType: row.address_type || "Home",
		isDefault: row.is_default || false,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}
function addressToRow(addr) {
	const row = {};
	if (addr.customerId !== void 0) row.customer_id = addr.customerId;
	if (addr.fullName !== void 0) row.full_name = addr.fullName;
	if (addr.phone !== void 0) row.phone = addr.phone;
	if (addr.email !== void 0) row.email = addr.email;
	if (addr.addressLine1 !== void 0) row.address_line1 = addr.addressLine1;
	if (addr.addressLine2 !== void 0) row.address_line2 = addr.addressLine2;
	if (addr.city !== void 0) row.city = addr.city;
	if (addr.state !== void 0) row.state = addr.state;
	if (addr.postalCode !== void 0) row.postal_code = addr.postalCode;
	if (addr.landmark !== void 0) row.landmark = addr.landmark;
	if (addr.addressType !== void 0) row.address_type = addr.addressType;
	if (addr.isDefault !== void 0) row.is_default = addr.isDefault;
	return row;
}
async function getCustomerAddresses(customerId) {
	try {
		const { data } = await db().from("customer_addresses").select("*").eq("customer_id", customerId).order("is_default", { ascending: false }).order("created_at", { ascending: false });
		return (data || []).map(rowToAddress);
	} catch {
		return [];
	}
}
async function saveCustomerAddress(params) {
	try {
		const fullName = params.fullName || "";
		const phone = params.phone || "";
		const email = params.email || "";
		const isDefault = params.isDefault || false;
		if (isDefault) await db().from("customer_addresses").update({ is_default: false }).eq("customer_id", params.customerId);
		const { data: existing } = await db().from("customer_addresses").select("id").eq("customer_id", params.customerId).eq("address_line1", params.addressLine1).eq("city", params.city).maybeSingle();
		if (existing) {
			const { data } = await db().from("customer_addresses").update({
				full_name: fullName,
				phone,
				email,
				address_line2: params.addressLine2 || "",
				state: params.state,
				postal_code: params.postalCode,
				landmark: params.landmark || "",
				address_type: params.addressType || "Home",
				is_default: isDefault,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", existing.id).select().single();
			return data ? rowToAddress(data) : null;
		}
		const { data } = await db().from("customer_addresses").insert({
			customer_id: params.customerId,
			full_name: fullName,
			phone,
			email,
			address_line1: params.addressLine1,
			address_line2: params.addressLine2 || "",
			city: params.city,
			state: params.state,
			postal_code: params.postalCode,
			landmark: params.landmark || "",
			address_type: params.addressType || "Home",
			is_default: isDefault,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).select().single();
		return data ? rowToAddress(data) : null;
	} catch {
		return null;
	}
}
async function updateCustomerAddress(addressId, params) {
	try {
		const row = addressToRow(params);
		row.updated_at = (/* @__PURE__ */ new Date()).toISOString();
		if (params.isDefault) {
			const { data: existing } = await db().from("customer_addresses").select("customer_id").eq("id", addressId).maybeSingle();
			if (existing) await db().from("customer_addresses").update({ is_default: false }).eq("customer_id", existing.customer_id).neq("id", addressId);
		}
		const { data } = await db().from("customer_addresses").update(row).eq("id", addressId).select().single();
		return data ? rowToAddress(data) : null;
	} catch {
		return null;
	}
}
async function setDefaultAddress(addressId, customerId) {
	try {
		await db().from("customer_addresses").update({
			is_default: false,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("customer_id", customerId);
		const { error } = await db().from("customer_addresses").update({
			is_default: true,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", addressId);
		return !error;
	} catch {
		return false;
	}
}
async function deleteCustomerAddress(addressId) {
	try {
		const { error } = await db().from("customer_addresses").delete().eq("id", addressId);
		return !error;
	} catch {
		return false;
	}
}
//#endregion
export { updateCustomerAddress as a, setDefaultAddress as i, getCustomerAddresses as n, saveCustomerAddress as r, deleteCustomerAddress as t };
