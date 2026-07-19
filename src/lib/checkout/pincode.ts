import { getStateCodeByName, getStateNameByCode, type PincodeLocation, type StateOption, type CityOption, INDIAN_STATES } from "./rates";

type PostalResponse = {
  Message: string;
  Status: "Success" | "Error" | "404";
  PostOffice: Array<{
    Name: string;
    Description: string | null;
    BranchType: string;
    DeliveryStatus: string;
    Circle: string;
    District: string;
    Division: string;
    Region: string;
    Block: string;
    State: string;
    Country: string;
    Pincode: string;
  }> | null;
};

const PINCODE_CACHE = new Map<string, { data: PincodeLocation[]; timestamp: number }>();
const CACHE_TTL = 3600000;

const BRANCH_ORDER: Record<string, number> = {
  "Delivery": 0,
  "PO": 1,
  "Sub Office": 2,
  "Sub Post Office": 2,
  "Branch Office": 3,
  "Head Office": 4,
  "Head Post Office": 4,
};

function parseBranchType(type: string): string {
  const t = type?.toLowerCase() || "";
  if (t.includes("head")) return "Head Office";
  if (t.includes("sub")) return "Sub Office";
  if (t.includes("delivery")) return "Delivery";
  if (t.includes("branch")) return "Branch Office";
  return type || "PO";
}

export async function lookupPincode(pincode: string): Promise<{
  locations: PincodeLocation[];
  error: string | null;
}> {
  const trimmed = pincode.trim();
  if (!/^\d{6}$/.test(trimmed)) {
    return { locations: [], error: "Invalid PIN code format. Must be exactly 6 digits." };
  }

  const cached = PINCODE_CACHE.get(trimmed);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { locations: cached.data, error: null };
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${trimmed}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      return { locations: [], error: "PIN code service unavailable. Please enter your address manually." };
    }
    const data: PostalResponse[] = await res.json();
    const first = data?.[0];
    if (!first || first.Status === "Error" || first.Status === "404" || !first.PostOffice?.length) {
      return { locations: [], error: "PIN code not found. Please verify and try again." };
    }

    const locations: PincodeLocation[] = first.PostOffice.map((po) => {
      const stateName = po.State?.trim() || "";
      const stateCode = getStateCodeByName(stateName) || stateName;
      return {
        pincode: po.Pincode || trimmed,
        stateCode,
        stateName,
        district: po.District?.trim() || "",
        city: po.District?.trim() || "",
        locality: po.Name?.trim() || "",
        postOfficeType: parseBranchType(po.BranchType),
      };
    });

    locations.sort((a, b) => {
      const aOrder = BRANCH_ORDER[a.postOfficeType || "PO"] ?? 99;
      const bOrder = BRANCH_ORDER[b.postOfficeType || "PO"] ?? 99;
      return aOrder - bOrder;
    });

    PINCODE_CACHE.set(trimmed, { data: locations, timestamp: Date.now() });
    return { locations, error: null };
  } catch (err: any) {
    if (err.name === "TimeoutError" || err.name === "AbortError") {
      return { locations: [], error: "PIN code lookup timed out. Please enter your address manually." };
    }
    return { locations: [], error: "Could not verify PIN code. Please enter your address manually." };
  }
}

export function validateIndianPincode(pincode: string): { valid: boolean; error?: string } {
  const trimmed = pincode.trim();
  if (!trimmed) return { valid: false, error: "PIN code is required." };
  if (!/^\d{6}$/.test(trimmed)) return { valid: false, error: "PIN code must be exactly 6 digits." };
  if (/^0{6}$/.test(trimmed)) return { valid: false, error: "Invalid PIN code." };
  return { valid: true };
}

export function detectStateConflict(params: {
  pincodeStateCode?: string;
  pincodeStateName?: string;
  selectedStateCode?: string;
  selectedStateName?: string;
}): { conflict: boolean; message?: string } {
  const pincodeCode = params.pincodeStateCode || (params.pincodeStateName ? getStateCodeByName(params.pincodeStateName) : undefined);
  const selectedCode = params.selectedStateCode || (params.selectedStateName ? getStateCodeByName(params.selectedStateName) : undefined);
  if (pincodeCode && selectedCode && pincodeCode !== selectedCode) {
    return {
      conflict: true,
      message: `This PIN code does not appear to match the selected city or state. Please verify your address.`,
    };
  }
  return { conflict: false };
}
