/* eslint-disable @typescript-eslint/no-explicit-any, no-empty */
import { storefrontSupabase } from "../supabase-storefront";

const db = () => storefrontSupabase as any;

export interface CustomerAddress {
  id: string;
  customerId: string;
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  landmark: string;
  addressType: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

function rowToAddress(row: any): CustomerAddress {
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
    updatedAt: row.updated_at,
  };
}

function addressToRow(addr: Partial<CustomerAddress>): any {
  const row: any = {};
  if (addr.customerId !== undefined) row.customer_id = addr.customerId;
  if (addr.fullName !== undefined) row.full_name = addr.fullName;
  if (addr.phone !== undefined) row.phone = addr.phone;
  if (addr.email !== undefined) row.email = addr.email;
  if (addr.addressLine1 !== undefined) row.address_line1 = addr.addressLine1;
  if (addr.addressLine2 !== undefined) row.address_line2 = addr.addressLine2;
  if (addr.city !== undefined) row.city = addr.city;
  if (addr.state !== undefined) row.state = addr.state;
  if (addr.postalCode !== undefined) row.postal_code = addr.postalCode;
  if (addr.landmark !== undefined) row.landmark = addr.landmark;
  if (addr.addressType !== undefined) row.address_type = addr.addressType;
  if (addr.isDefault !== undefined) row.is_default = addr.isDefault;
  return row;
}

export async function getCustomerId(authUserId: string): Promise<string | null> {
  try {
    const { data } = await db()
      .from("customers")
      .select("id")
      .eq("auth_user_id", authUserId)
      .maybeSingle();
    return data?.id || null;
  } catch {
    return null;
  }
}

export async function getCustomerAddresses(customerId: string): Promise<CustomerAddress[]> {
  try {
    const { data } = await db()
      .from("customer_addresses")
      .select("*")
      .eq("customer_id", customerId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    return (data || []).map(rowToAddress);
  } catch {
    return [];
  }
}

export async function getCustomerAddressById(addressId: string): Promise<CustomerAddress | null> {
  try {
    const { data } = await db()
      .from("customer_addresses")
      .select("*")
      .eq("id", addressId)
      .maybeSingle();
    return data ? rowToAddress(data) : null;
  } catch {
    return null;
  }
}

export async function saveCustomerAddress(params: {
  customerId: string;
  fullName?: string;
  phone?: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  landmark?: string;
  addressType?: string;
  isDefault?: boolean;
}): Promise<CustomerAddress | null> {
  try {
    const fullName = params.fullName || "";
    const phone = params.phone || "";
    const email = params.email || "";
    const isDefault = params.isDefault || false;

    if (isDefault) {
      await db()
        .from("customer_addresses")
        .update({ is_default: false })
        .eq("customer_id", params.customerId);
    }

    const { data: existing } = await db()
      .from("customer_addresses")
      .select("id")
      .eq("customer_id", params.customerId)
      .eq("address_line1", params.addressLine1)
      .eq("city", params.city)
      .maybeSingle();

    if (existing) {
      const { data } = await db()
        .from("customer_addresses")
        .update({
          full_name: fullName,
          phone,
          email,
          address_line2: params.addressLine2 || "",
          state: params.state,
          postal_code: params.postalCode,
          landmark: params.landmark || "",
          address_type: params.addressType || "Home",
          is_default: isDefault,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();
      return data ? rowToAddress(data) : null;
    }

    const { data } = await db()
      .from("customer_addresses")
      .insert({
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
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    return data ? rowToAddress(data) : null;
  } catch {
    return null;
  }
}

export async function updateCustomerAddress(
  addressId: string,
  params: Partial<{
    fullName: string;
    phone: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    landmark: string;
    addressType: string;
    isDefault: boolean;
  }>,
): Promise<CustomerAddress | null> {
  try {
    const row = addressToRow(params);
    row.updated_at = new Date().toISOString();

    if (params.isDefault) {
      const { data: existing } = await db()
        .from("customer_addresses")
        .select("customer_id")
        .eq("id", addressId)
        .maybeSingle();
      if (existing) {
        await db()
          .from("customer_addresses")
          .update({ is_default: false })
          .eq("customer_id", existing.customer_id)
          .neq("id", addressId);
      }
    }

    const { data } = await db()
      .from("customer_addresses")
      .update(row)
      .eq("id", addressId)
      .select()
      .single();
    return data ? rowToAddress(data) : null;
  } catch {
    return null;
  }
}

export async function setDefaultAddress(addressId: string, customerId: string): Promise<boolean> {
  try {
    await db()
      .from("customer_addresses")
      .update({ is_default: false, updated_at: new Date().toISOString() })
      .eq("customer_id", customerId);
    const { error } = await db()
      .from("customer_addresses")
      .update({ is_default: true, updated_at: new Date().toISOString() })
      .eq("id", addressId);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteCustomerAddress(addressId: string): Promise<boolean> {
  try {
    const { error } = await db()
      .from("customer_addresses")
      .delete()
      .eq("id", addressId);
    return !error;
  } catch {
    return false;
  }
}
