import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./auth";
import {
  getCustomerAddresses,
  saveCustomerAddress,
  updateCustomerAddress,
  setDefaultAddress,
  deleteCustomerAddress,
  type CustomerAddress,
} from "./api/addresses";

type AddressCtx = {
  addresses: CustomerAddress[];
  loading: boolean;
  defaultAddress: CustomerAddress | null;
  refreshAddresses: () => Promise<void>;
  addAddress: (params: Parameters<typeof saveCustomerAddress>[0]) => Promise<CustomerAddress | null>;
  editAddress: (id: string, params: Parameters<typeof updateCustomerAddress>[1]) => Promise<CustomerAddress | null>;
  removeAddress: (id: string) => Promise<boolean>;
  markDefault: (id: string) => Promise<boolean>;
};

const Ctx = createContext<AddressCtx | null>(null);

export function AddressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setCustomerId(user.id);
    } else {
      setCustomerId(null);
      setAddresses([]);
    }
  }, [user]);

  const refreshAddresses = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    const data = await getCustomerAddresses(customerId);
    setAddresses(data);
    setLoading(false);
  }, [customerId]);

  useEffect(() => {
    if (customerId) refreshAddresses();
  }, [customerId, refreshAddresses]);

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0] || null;

  const addAddress = useCallback(
    async (params: Parameters<typeof saveCustomerAddress>[0]) => {
      const result = await saveCustomerAddress(params);
      if (result) await refreshAddresses();
      return result;
    },
    [refreshAddresses],
  );

  const editAddress = useCallback(
    async (id: string, params: Parameters<typeof updateCustomerAddress>[1]) => {
      const result = await updateCustomerAddress(id, params);
      if (result) await refreshAddresses();
      return result;
    },
    [refreshAddresses],
  );

  const removeAddress = useCallback(
    async (id: string) => {
      const ok = await deleteCustomerAddress(id);
      if (ok) await refreshAddresses();
      return ok;
    },
    [refreshAddresses],
  );

  const markDefault = useCallback(
    async (id: string) => {
      if (!customerId) return false;
      const ok = await setDefaultAddress(id, customerId);
      if (ok) await refreshAddresses();
      return ok;
    },
    [customerId, refreshAddresses],
  );

  return (
    <Ctx.Provider value={{ addresses, loading, defaultAddress, refreshAddresses, addAddress, editAddress, removeAddress, markDefault }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAddresses(): AddressCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAddresses must be used inside <AddressProvider>");
  return ctx;
}
