import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
import { t as storefrontSupabase } from "./supabase-storefront-B2iEpuwU.mjs";
import { i as sendTransactionalEmail } from "./server-DlvYJMt6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-CST5jHga.js
var DEFAULT_DELIVERY = {
	standard: {
		label: "Standard Insured Delivery",
		charge: 0,
		days: "3–5 business days",
		description: "Free · 3–5 business days"
	},
	express: {
		label: "Express Delivery",
		charge: 450,
		days: "1–2 business days",
		description: "₹450 · 1–2 business days"
	},
	freeShippingThreshold: 5e3
};
var DEFAULT_TAX_SETTINGS = {
	enabled: false,
	mode: "exclusive",
	defaultRate: 18,
	cgstRate: 9,
	sgstRate: 9,
	igstRate: 18,
	businessGstin: "",
	businessState: "Gujarat",
	businessStateCode: "GJ",
	taxLabel: "GST",
	applyGstToShipping: false,
	displayBreakdown: true,
	roundingRule: "round",
	invoiceTaxNote: "Prices are inclusive of all taxes."
};
var INDIAN_STATES = [
	{
		code: "AP",
		name: "Andhra Pradesh"
	},
	{
		code: "AR",
		name: "Arunachal Pradesh"
	},
	{
		code: "AS",
		name: "Assam"
	},
	{
		code: "BR",
		name: "Bihar"
	},
	{
		code: "CG",
		name: "Chhattisgarh"
	},
	{
		code: "GA",
		name: "Goa"
	},
	{
		code: "GJ",
		name: "Gujarat"
	},
	{
		code: "HR",
		name: "Haryana"
	},
	{
		code: "HP",
		name: "Himachal Pradesh"
	},
	{
		code: "JK",
		name: "Jammu and Kashmir"
	},
	{
		code: "JH",
		name: "Jharkhand"
	},
	{
		code: "KA",
		name: "Karnataka"
	},
	{
		code: "KL",
		name: "Kerala"
	},
	{
		code: "MP",
		name: "Madhya Pradesh"
	},
	{
		code: "MH",
		name: "Maharashtra"
	},
	{
		code: "MN",
		name: "Manipur"
	},
	{
		code: "ML",
		name: "Meghalaya"
	},
	{
		code: "MZ",
		name: "Mizoram"
	},
	{
		code: "NL",
		name: "Nagaland"
	},
	{
		code: "OD",
		name: "Odisha"
	},
	{
		code: "PB",
		name: "Punjab"
	},
	{
		code: "RJ",
		name: "Rajasthan"
	},
	{
		code: "SK",
		name: "Sikkim"
	},
	{
		code: "TN",
		name: "Tamil Nadu"
	},
	{
		code: "TS",
		name: "Telangana"
	},
	{
		code: "TR",
		name: "Tripura"
	},
	{
		code: "UP",
		name: "Uttar Pradesh"
	},
	{
		code: "UK",
		name: "Uttarakhand"
	},
	{
		code: "WB",
		name: "West Bengal"
	},
	{
		code: "AN",
		name: "Andaman and Nicobar Islands"
	},
	{
		code: "CH",
		name: "Chandigarh"
	},
	{
		code: "DH",
		name: "Dadra and Nagar Haveli and Daman and Diu"
	},
	{
		code: "DL",
		name: "Delhi"
	},
	{
		code: "LD",
		name: "Lakshadweep"
	},
	{
		code: "PY",
		name: "Puducherry"
	}
];
var INDIAN_CITIES = [
	{
		id: "gj-ahmedabad",
		name: "Ahmedabad",
		stateCode: "GJ"
	},
	{
		id: "gj-amreli",
		name: "Amreli",
		stateCode: "GJ"
	},
	{
		id: "gj-anand",
		name: "Anand",
		stateCode: "GJ"
	},
	{
		id: "gj-aravalli",
		name: "Aravalli",
		stateCode: "GJ"
	},
	{
		id: "gj-banaskantha",
		name: "Banaskantha",
		stateCode: "GJ"
	},
	{
		id: "gj-bharuch",
		name: "Bharuch",
		stateCode: "GJ"
	},
	{
		id: "gj-bhavnagar",
		name: "Bhavnagar",
		stateCode: "GJ"
	},
	{
		id: "gj-botad",
		name: "Botad",
		stateCode: "GJ"
	},
	{
		id: "gj-chhota-udaipur",
		name: "Chhota Udaipur",
		stateCode: "GJ"
	},
	{
		id: "gj-dahod",
		name: "Dahod",
		stateCode: "GJ"
	},
	{
		id: "gj-dang",
		name: "Dang",
		stateCode: "GJ"
	},
	{
		id: "gj-devbhumi-dwarka",
		name: "Devbhoomi Dwarka",
		stateCode: "GJ"
	},
	{
		id: "gj-gandhinagar",
		name: "Gandhinagar",
		stateCode: "GJ"
	},
	{
		id: "gj-gir-somnath",
		name: "Gir Somnath",
		stateCode: "GJ"
	},
	{
		id: "gj-jamnagar",
		name: "Jamnagar",
		stateCode: "GJ"
	},
	{
		id: "gj-junagadh",
		name: "Junagadh",
		stateCode: "GJ"
	},
	{
		id: "gj-kheda",
		name: "Kheda",
		stateCode: "GJ"
	},
	{
		id: "gj-kutch",
		name: "Kutch",
		stateCode: "GJ"
	},
	{
		id: "gj-mahisagar",
		name: "Mahisagar",
		stateCode: "GJ"
	},
	{
		id: "gj-mehsana",
		name: "Mehsana",
		stateCode: "GJ"
	},
	{
		id: "gj-morbi",
		name: "Morbi",
		stateCode: "GJ"
	},
	{
		id: "gj-narmada",
		name: "Narmada",
		stateCode: "GJ"
	},
	{
		id: "gj-navsari",
		name: "Navsari",
		stateCode: "GJ"
	},
	{
		id: "gj-panchmahal",
		name: "Panchmahal",
		stateCode: "GJ"
	},
	{
		id: "gj-patan",
		name: "Patan",
		stateCode: "GJ"
	},
	{
		id: "gj-porbandar",
		name: "Porbandar",
		stateCode: "GJ"
	},
	{
		id: "gj-rajkot",
		name: "Rajkot",
		stateCode: "GJ"
	},
	{
		id: "gj-sabarkantha",
		name: "Sabarkantha",
		stateCode: "GJ"
	},
	{
		id: "gj-surat",
		name: "Surat",
		stateCode: "GJ"
	},
	{
		id: "gj-surendranagar",
		name: "Surendranagar",
		stateCode: "GJ"
	},
	{
		id: "gj-tapi",
		name: "Tapi",
		stateCode: "GJ"
	},
	{
		id: "gj-vadodara",
		name: "Vadodara",
		stateCode: "GJ"
	},
	{
		id: "gj-valsad",
		name: "Valsad",
		stateCode: "GJ"
	},
	{
		id: "mh-ahmednagar",
		name: "Ahmednagar",
		stateCode: "MH"
	},
	{
		id: "mh-akola",
		name: "Akola",
		stateCode: "MH"
	},
	{
		id: "mh-amravati",
		name: "Amravati",
		stateCode: "MH"
	},
	{
		id: "mh-aurangabad",
		name: "Aurangabad",
		stateCode: "MH"
	},
	{
		id: "mh-bhandara",
		name: "Bhandara",
		stateCode: "MH"
	},
	{
		id: "mh-buldhana",
		name: "Buldhana",
		stateCode: "MH"
	},
	{
		id: "mh-chandrapur",
		name: "Chandrapur",
		stateCode: "MH"
	},
	{
		id: "mh-dhule",
		name: "Dhule",
		stateCode: "MH"
	},
	{
		id: "mh-gadchiroli",
		name: "Gadchiroli",
		stateCode: "MH"
	},
	{
		id: "mh-gondia",
		name: "Gondia",
		stateCode: "MH"
	},
	{
		id: "mh-hingoli",
		name: "Hingoli",
		stateCode: "MH"
	},
	{
		id: "mh-jalgaon",
		name: "Jalgaon",
		stateCode: "MH"
	},
	{
		id: "mh-jalna",
		name: "Jalna",
		stateCode: "MH"
	},
	{
		id: "mh-kolhapur",
		name: "Kolhapur",
		stateCode: "MH"
	},
	{
		id: "mh-latur",
		name: "Latur",
		stateCode: "MH"
	},
	{
		id: "mh-mumbai",
		name: "Mumbai",
		stateCode: "MH"
	},
	{
		id: "mh-mumbai-suburban",
		name: "Mumbai Suburban",
		stateCode: "MH"
	},
	{
		id: "mh-nagpur",
		name: "Nagpur",
		stateCode: "MH"
	},
	{
		id: "mh-nanded",
		name: "Nanded",
		stateCode: "MH"
	},
	{
		id: "mh-nandurbar",
		name: "Nandurbar",
		stateCode: "MH"
	},
	{
		id: "mh-nashik",
		name: "Nashik",
		stateCode: "MH"
	},
	{
		id: "mh-osmanabad",
		name: "Osmanabad",
		stateCode: "MH"
	},
	{
		id: "mh-palghar",
		name: "Palghar",
		stateCode: "MH"
	},
	{
		id: "mh-parbhani",
		name: "Parbhani",
		stateCode: "MH"
	},
	{
		id: "mh-pune",
		name: "Pune",
		stateCode: "MH"
	},
	{
		id: "mh-raigad",
		name: "Raigad",
		stateCode: "MH"
	},
	{
		id: "mh-ratnagiri",
		name: "Ratnagiri",
		stateCode: "MH"
	},
	{
		id: "mh-sangli",
		name: "Sangli",
		stateCode: "MH"
	},
	{
		id: "mh-satara",
		name: "Satara",
		stateCode: "MH"
	},
	{
		id: "mh-sindhudurg",
		name: "Sindhudurg",
		stateCode: "MH"
	},
	{
		id: "mh-solapur",
		name: "Solapur",
		stateCode: "MH"
	},
	{
		id: "mh-thane",
		name: "Thane",
		stateCode: "MH"
	},
	{
		id: "mh-wardha",
		name: "Wardha",
		stateCode: "MH"
	},
	{
		id: "mh-washim",
		name: "Washim",
		stateCode: "MH"
	},
	{
		id: "mh-yavatmal",
		name: "Yavatmal",
		stateCode: "MH"
	},
	{
		id: "rj-ajmer",
		name: "Ajmer",
		stateCode: "RJ"
	},
	{
		id: "rj-alwar",
		name: "Alwar",
		stateCode: "RJ"
	},
	{
		id: "rj-banswara",
		name: "Banswara",
		stateCode: "RJ"
	},
	{
		id: "rj-baran",
		name: "Baran",
		stateCode: "RJ"
	},
	{
		id: "rj-barmer",
		name: "Barmer",
		stateCode: "RJ"
	},
	{
		id: "rj-bharatpur",
		name: "Bharatpur",
		stateCode: "RJ"
	},
	{
		id: "rj-bhilwara",
		name: "Bhilwara",
		stateCode: "RJ"
	},
	{
		id: "rj-bikaner",
		name: "Bikaner",
		stateCode: "RJ"
	},
	{
		id: "rj-bundi",
		name: "Bundi",
		stateCode: "RJ"
	},
	{
		id: "rj-chittorgarh",
		name: "Chittorgarh",
		stateCode: "RJ"
	},
	{
		id: "rj-churu",
		name: "Churu",
		stateCode: "RJ"
	},
	{
		id: "rj-dausa",
		name: "Dausa",
		stateCode: "RJ"
	},
	{
		id: "rj-dholpur",
		name: "Dholpur",
		stateCode: "RJ"
	},
	{
		id: "rj-dungarpur",
		name: "Dungarpur",
		stateCode: "RJ"
	},
	{
		id: "rj-hanumangarh",
		name: "Hanumangarh",
		stateCode: "RJ"
	},
	{
		id: "rj-jaipur",
		name: "Jaipur",
		stateCode: "RJ"
	},
	{
		id: "rj-jaisalmer",
		name: "Jaisalmer",
		stateCode: "RJ"
	},
	{
		id: "rj-jalore",
		name: "Jalore",
		stateCode: "RJ"
	},
	{
		id: "rj-jhalawar",
		name: "Jhalawar",
		stateCode: "RJ"
	},
	{
		id: "rj-jhunjhunu",
		name: "Jhunjhunu",
		stateCode: "RJ"
	},
	{
		id: "rj-jodhpur",
		name: "Jodhpur",
		stateCode: "RJ"
	},
	{
		id: "rj-karauli",
		name: "Karauli",
		stateCode: "RJ"
	},
	{
		id: "rj-kota",
		name: "Kota",
		stateCode: "RJ"
	},
	{
		id: "rj-nagaur",
		name: "Nagaur",
		stateCode: "RJ"
	},
	{
		id: "rj-pali",
		name: "Pali",
		stateCode: "RJ"
	},
	{
		id: "rj-pratapgarh",
		name: "Pratapgarh",
		stateCode: "RJ"
	},
	{
		id: "rj-rajsamand",
		name: "Rajsamand",
		stateCode: "RJ"
	},
	{
		id: "rj-sawai-madhopur",
		name: "Sawai Madhopur",
		stateCode: "RJ"
	},
	{
		id: "rj-sikar",
		name: "Sikar",
		stateCode: "RJ"
	},
	{
		id: "rj-sirohi",
		name: "Sirohi",
		stateCode: "RJ"
	},
	{
		id: "rj-sri-ganganagar",
		name: "Sri Ganganagar",
		stateCode: "RJ"
	},
	{
		id: "rj-tonk",
		name: "Tonk",
		stateCode: "RJ"
	},
	{
		id: "rj-udaipur",
		name: "Udaipur",
		stateCode: "RJ"
	},
	{
		id: "dl-central",
		name: "Central Delhi",
		stateCode: "DL"
	},
	{
		id: "dl-east",
		name: "East Delhi",
		stateCode: "DL"
	},
	{
		id: "dl-new-delhi",
		name: "New Delhi",
		stateCode: "DL"
	},
	{
		id: "dl-north",
		name: "North Delhi",
		stateCode: "DL"
	},
	{
		id: "dl-north-east",
		name: "North East Delhi",
		stateCode: "DL"
	},
	{
		id: "dl-north-west",
		name: "North West Delhi",
		stateCode: "DL"
	},
	{
		id: "dl-shahdara",
		name: "Shahdara",
		stateCode: "DL"
	},
	{
		id: "dl-south",
		name: "South Delhi",
		stateCode: "DL"
	},
	{
		id: "dl-south-east",
		name: "South East Delhi",
		stateCode: "DL"
	},
	{
		id: "dl-south-west",
		name: "South West Delhi",
		stateCode: "DL"
	},
	{
		id: "dl-west",
		name: "West Delhi",
		stateCode: "DL"
	},
	{
		id: "ka-bagalkot",
		name: "Bagalkot",
		stateCode: "KA"
	},
	{
		id: "ka-ballari",
		name: "Ballari",
		stateCode: "KA"
	},
	{
		id: "ka-belagavi",
		name: "Belagavi",
		stateCode: "KA"
	},
	{
		id: "ka-bengaluru-rural",
		name: "Bengaluru Rural",
		stateCode: "KA"
	},
	{
		id: "ka-bengaluru-urban",
		name: "Bengaluru Urban",
		stateCode: "KA"
	},
	{
		id: "ka-bidar",
		name: "Bidar",
		stateCode: "KA"
	},
	{
		id: "ka-chamarajanagar",
		name: "Chamarajanagar",
		stateCode: "KA"
	},
	{
		id: "ka-chikballapur",
		name: "Chikballapur",
		stateCode: "KA"
	},
	{
		id: "ka-chikkamagaluru",
		name: "Chikkamagaluru",
		stateCode: "KA"
	},
	{
		id: "ka-chitradurga",
		name: "Chitradurga",
		stateCode: "KA"
	},
	{
		id: "ka-dakshina-kannada",
		name: "Dakshina Kannada",
		stateCode: "KA"
	},
	{
		id: "ka-davanagere",
		name: "Davanagere",
		stateCode: "KA"
	},
	{
		id: "ka-dharwad",
		name: "Dharwad",
		stateCode: "KA"
	},
	{
		id: "ka-gadag",
		name: "Gadag",
		stateCode: "KA"
	},
	{
		id: "ka-hassan",
		name: "Hassan",
		stateCode: "KA"
	},
	{
		id: "ka-haveri",
		name: "Haveri",
		stateCode: "KA"
	},
	{
		id: "ka-kalaburagi",
		name: "Kalaburagi",
		stateCode: "KA"
	},
	{
		id: "ka-kodagu",
		name: "Kodagu",
		stateCode: "KA"
	},
	{
		id: "ka-kolar",
		name: "Kolar",
		stateCode: "KA"
	},
	{
		id: "ka-kolar",
		name: "Kolar",
		stateCode: "KA"
	},
	{
		id: "ka-raichur",
		name: "Raichur",
		stateCode: "KA"
	},
	{
		id: "ka-ramanagara",
		name: "Ramanagara",
		stateCode: "KA"
	},
	{
		id: "ka-shivamogga",
		name: "Shivamogga",
		stateCode: "KA"
	},
	{
		id: "ka-tumakuru",
		name: "Tumakuru",
		stateCode: "KA"
	},
	{
		id: "ka-udupi",
		name: "Udupi",
		stateCode: "KA"
	},
	{
		id: "ka-uttara-kannada",
		name: "Uttara Kannada",
		stateCode: "KA"
	},
	{
		id: "ka-vijayanagara",
		name: "Vijayanagara",
		stateCode: "KA"
	},
	{
		id: "ka-vijayapura",
		name: "Vijayapura",
		stateCode: "KA"
	},
	{
		id: "ka-yadgir",
		name: "Yadgir",
		stateCode: "KA"
	},
	{
		id: "tn-ariyalur",
		name: "Ariyalur",
		stateCode: "TN"
	},
	{
		id: "tn-chengalpattu",
		name: "Chengalpattu",
		stateCode: "TN"
	},
	{
		id: "tn-chennai",
		name: "Chennai",
		stateCode: "TN"
	},
	{
		id: "tn-coimbatore",
		name: "Coimbatore",
		stateCode: "TN"
	},
	{
		id: "tn-cuddalore",
		name: "Cuddalore",
		stateCode: "TN"
	},
	{
		id: "tn-dharmapuri",
		name: "Dharmapuri",
		stateCode: "TN"
	},
	{
		id: "tn-dindigul",
		name: "Dindigul",
		stateCode: "TN"
	},
	{
		id: "tn-erode",
		name: "Erode",
		stateCode: "TN"
	},
	{
		id: "tn-kallakurichi",
		name: "Kallakurichi",
		stateCode: "TN"
	},
	{
		id: "tn-kanchipuram",
		name: "Kanchipuram",
		stateCode: "TN"
	},
	{
		id: "tn-kanniyakumari",
		name: "Kanniyakumari",
		stateCode: "TN"
	},
	{
		id: "tn-karur",
		name: "Karur",
		stateCode: "TN"
	},
	{
		id: "tn-krishnagiri",
		name: "Krishnagiri",
		stateCode: "TN"
	},
	{
		id: "tn-madurai",
		name: "Madurai",
		stateCode: "TN"
	},
	{
		id: "tn-mayiladuthurai",
		name: "Mayiladuthurai",
		stateCode: "TN"
	},
	{
		id: "tn-nagapattinam",
		name: "Nagapattinam",
		stateCode: "TN"
	},
	{
		id: "tn-namakkal",
		name: "Namakkal",
		stateCode: "TN"
	},
	{
		id: "tn-nilgiris",
		name: "Nilgiris",
		stateCode: "TN"
	},
	{
		id: "tn-perambalur",
		name: "Perambalur",
		stateCode: "TN"
	},
	{
		id: "tn-pudukkottai",
		name: "Pudukkottai",
		stateCode: "TN"
	},
	{
		id: "tn-ramanathapuram",
		name: "Ramanathapuram",
		stateCode: "TN"
	},
	{
		id: "tn-ranipet",
		name: "Ranipet",
		stateCode: "TN"
	},
	{
		id: "tn-salem",
		name: "Salem",
		stateCode: "TN"
	},
	{
		id: "tn-sivaganga",
		name: "Sivaganga",
		stateCode: "TN"
	},
	{
		id: "tn-tenkasi",
		name: "Tenkasi",
		stateCode: "TN"
	},
	{
		id: "tn-thanjavur",
		name: "Thanjavur",
		stateCode: "TN"
	},
	{
		id: "tn-theni",
		name: "Theni",
		stateCode: "TN"
	},
	{
		id: "tn-thoothukudi",
		name: "Thoothukudi",
		stateCode: "TN"
	},
	{
		id: "tn-tiruchirappalli",
		name: "Tiruchirappalli",
		stateCode: "TN"
	},
	{
		id: "tn-tirunelveli",
		name: "Tirunelveli",
		stateCode: "TN"
	},
	{
		id: "tn-tirupathur",
		name: "Tirupathur",
		stateCode: "TN"
	},
	{
		id: "tn-tiruppur",
		name: "Tiruppur",
		stateCode: "TN"
	},
	{
		id: "tn-tiruvallur",
		name: "Tiruvallur",
		stateCode: "TN"
	},
	{
		id: "tn-tiruvannamalai",
		name: "Tiruvannamalai",
		stateCode: "TN"
	},
	{
		id: "tn-tiruvarur",
		name: "Tiruvarur",
		stateCode: "TN"
	},
	{
		id: "tn-vellore",
		name: "Vellore",
		stateCode: "TN"
	},
	{
		id: "tn-viluppuram",
		name: "Viluppuram",
		stateCode: "TN"
	},
	{
		id: "tn-virudhunagar",
		name: "Virudhunagar",
		stateCode: "TN"
	},
	{
		id: "up-agra",
		name: "Agra",
		stateCode: "UP"
	},
	{
		id: "up-aligarh",
		name: "Aligarh",
		stateCode: "UP"
	},
	{
		id: "up-ambedkar-nagar",
		name: "Ambedkar Nagar",
		stateCode: "UP"
	},
	{
		id: "up-amethi",
		name: "Amethi",
		stateCode: "UP"
	},
	{
		id: "up-amroha",
		name: "Amroha",
		stateCode: "UP"
	},
	{
		id: "up-auraiya",
		name: "Auraiya",
		stateCode: "UP"
	},
	{
		id: "up-ayodhya",
		name: "Ayodhya",
		stateCode: "UP"
	},
	{
		id: "up-azamgarh",
		name: "Azamgarh",
		stateCode: "UP"
	},
	{
		id: "up-baghpat",
		name: "Baghpat",
		stateCode: "UP"
	},
	{
		id: "up-bahraich",
		name: "Bahraich",
		stateCode: "UP"
	},
	{
		id: "up-ballia",
		name: "Ballia",
		stateCode: "UP"
	},
	{
		id: "up-bandha",
		name: "Bandha",
		stateCode: "UP"
	},
	{
		id: "up-barabanki",
		name: "Barabanki",
		stateCode: "UP"
	},
	{
		id: "up-bareilly",
		name: "Bareilly",
		stateCode: "UP"
	},
	{
		id: "up-basti",
		name: "Basti",
		stateCode: "UP"
	},
	{
		id: "up-bhadohi",
		name: "Bhadohi",
		stateCode: "UP"
	},
	{
		id: "up-bijnor",
		name: "Bijnor",
		stateCode: "UP"
	},
	{
		id: "up-budaun",
		name: "Budaun",
		stateCode: "UP"
	},
	{
		id: "up-bulandshahr",
		name: "Bulandshahr",
		stateCode: "UP"
	},
	{
		id: "up-chandauli",
		name: "Chandauli",
		stateCode: "UP"
	},
	{
		id: "up-chitrakoot",
		name: "Chitrakoot",
		stateCode: "UP"
	},
	{
		id: "up-deoria",
		name: "Deoria",
		stateCode: "UP"
	},
	{
		id: "up-etah",
		name: "Etah",
		stateCode: "UP"
	},
	{
		id: "up-etawah",
		name: "Etawah",
		stateCode: "UP"
	},
	{
		id: "up-farrukhabad",
		name: "Farrukhabad",
		stateCode: "UP"
	},
	{
		id: "up-fatehpur",
		name: "Fatehpur",
		stateCode: "UP"
	},
	{
		id: "up-firozabad",
		name: "Firozabad",
		stateCode: "UP"
	},
	{
		id: "up-gautam-buddha-nagar",
		name: "Gautam Buddha Nagar",
		stateCode: "UP"
	},
	{
		id: "up-ghaziabad",
		name: "Ghaziabad",
		stateCode: "UP"
	},
	{
		id: "up-ghazipur",
		name: "Ghazipur",
		stateCode: "UP"
	},
	{
		id: "up-gonda",
		name: "Gonda",
		stateCode: "UP"
	},
	{
		id: "up-gorakhpur",
		name: "Gorakhpur",
		stateCode: "UP"
	},
	{
		id: "up-hamirpur",
		name: "Hamirpur",
		stateCode: "UP"
	},
	{
		id: "up-hapur",
		name: "Hapur",
		stateCode: "UP"
	},
	{
		id: "up-hardoi",
		name: "Hardoi",
		stateCode: "UP"
	},
	{
		id: "up-hathras",
		name: "Hathras",
		stateCode: "UP"
	},
	{
		id: "up-jalaun",
		name: "Jalaun",
		stateCode: "UP"
	},
	{
		id: "up-jaunpur",
		name: "Jaunpur",
		stateCode: "UP"
	},
	{
		id: "up-jhansi",
		name: "Jhansi",
		stateCode: "UP"
	},
	{
		id: "up-kannauj",
		name: "Kannauj",
		stateCode: "UP"
	},
	{
		id: "up-kanpur-dehat",
		name: "Kanpur Dehat",
		stateCode: "UP"
	},
	{
		id: "up-kanpur-nagar",
		name: "Kanpur Nagar",
		stateCode: "UP"
	},
	{
		id: "up-kasganj",
		name: "Kasganj",
		stateCode: "UP"
	},
	{
		id: "up-kaushambi",
		name: "Kaushambi",
		stateCode: "UP"
	},
	{
		id: "up-kushinagar",
		name: "Kushinagar",
		stateCode: "UP"
	},
	{
		id: "up-lakhimpur-kheri",
		name: "Lakhimpur Kheri",
		stateCode: "UP"
	},
	{
		id: "up-lalitpur",
		name: "Lalitpur",
		stateCode: "UP"
	},
	{
		id: "up-lucknow",
		name: "Lucknow",
		stateCode: "UP"
	},
	{
		id: "up-maharajganj",
		name: "Maharajganj",
		stateCode: "UP"
	},
	{
		id: "up-mahoba",
		name: "Mahoba",
		stateCode: "UP"
	},
	{
		id: "up-mainpuri",
		name: "Mainpuri",
		stateCode: "UP"
	},
	{
		id: "up-mathura",
		name: "Mathura",
		stateCode: "UP"
	},
	{
		id: "up-mau",
		name: "Mau",
		stateCode: "UP"
	},
	{
		id: "up-meerut",
		name: "Meerut",
		stateCode: "UP"
	},
	{
		id: "up-mirzapur",
		name: "Mirzapur",
		stateCode: "UP"
	},
	{
		id: "up-moradabad",
		name: "Moradabad",
		stateCode: "UP"
	},
	{
		id: "up-muzaffarnagar",
		name: "Muzaffarnagar",
		stateCode: "UP"
	},
	{
		id: "up-pilibhit",
		name: "Pilibhit",
		stateCode: "UP"
	},
	{
		id: "up-prayagraj",
		name: "Prayagraj",
		stateCode: "UP"
	},
	{
		id: "up-raebareli",
		name: "Raebareli",
		stateCode: "UP"
	},
	{
		id: "up-rampur",
		name: "Rampur",
		stateCode: "UP"
	},
	{
		id: "up-saharanpur",
		name: "Saharanpur",
		stateCode: "UP"
	},
	{
		id: "up-sambhal",
		name: "Sambhal",
		stateCode: "UP"
	},
	{
		id: "up-sant-kabir-nagar",
		name: "Sant Kabir Nagar",
		stateCode: "UP"
	},
	{
		id: "up-shahjahanpur",
		name: "Shahjahanpur",
		stateCode: "UP"
	},
	{
		id: "up-shamli",
		name: "Shamli",
		stateCode: "UP"
	},
	{
		id: "up-siddharthnagar",
		name: "Siddharthnagar",
		stateCode: "UP"
	},
	{
		id: "up-sitapur",
		name: "Sitapur",
		stateCode: "UP"
	},
	{
		id: "up-sonbhadra",
		name: "Sonbhadra",
		stateCode: "UP"
	},
	{
		id: "up-sultanpur",
		name: "Sultanpur",
		stateCode: "UP"
	},
	{
		id: "up-unnao",
		name: "Unnao",
		stateCode: "UP"
	},
	{
		id: "up-varanasi",
		name: "Varanasi",
		stateCode: "UP"
	},
	{
		id: "wb-alipurduar",
		name: "Alipurduar",
		stateCode: "WB"
	},
	{
		id: "wb-bankura",
		name: "Bankura",
		stateCode: "WB"
	},
	{
		id: "wb-birbhum",
		name: "Birbhum",
		stateCode: "WB"
	},
	{
		id: "wb-cooch-behar",
		name: "Cooch Behar",
		stateCode: "WB"
	},
	{
		id: "wb-darjeeling",
		name: "Darjeeling",
		stateCode: "WB"
	},
	{
		id: "wb-dakshin-dinajpur",
		name: "Dakshin Dinajpur",
		stateCode: "WB"
	},
	{
		id: "wb-hooghly",
		name: "Hooghly",
		stateCode: "WB"
	},
	{
		id: "wb-howrah",
		name: "Howrah",
		stateCode: "WB"
	},
	{
		id: "wb-jalpaiguri",
		name: "Jalpaiguri",
		stateCode: "WB"
	},
	{
		id: "wb-jhargram",
		name: "Jhargram",
		stateCode: "WB"
	},
	{
		id: "wb-kalimpong",
		name: "Kalimpong",
		stateCode: "WB"
	},
	{
		id: "wb-kolkata",
		name: "Kolkata",
		stateCode: "WB"
	},
	{
		id: "wb-malda",
		name: "Malda",
		stateCode: "WB"
	},
	{
		id: "wb-murshidabad",
		name: "Murshidabad",
		stateCode: "WB"
	},
	{
		id: "wb-nadia",
		name: "Nadia",
		stateCode: "WB"
	},
	{
		id: "wb-north-24-parganas",
		name: "North 24 Parganas",
		stateCode: "WB"
	},
	{
		id: "wb-paschim-bardhaman",
		name: "Paschim Bardhaman",
		stateCode: "WB"
	},
	{
		id: "wb-paschim-medinipur",
		name: "Paschim Medinipur",
		stateCode: "WB"
	},
	{
		id: "wb-purba-bardhaman",
		name: "Purba Bardhaman",
		stateCode: "WB"
	},
	{
		id: "wb-purba-medinipur",
		name: "Purba Medinipur",
		stateCode: "WB"
	},
	{
		id: "wb-purulia",
		name: "Purulia",
		stateCode: "WB"
	},
	{
		id: "wb-south-24-parganas",
		name: "South 24 Parganas",
		stateCode: "WB"
	},
	{
		id: "wb-uttar-dinajpur",
		name: "Uttar Dinajpur",
		stateCode: "WB"
	},
	{
		id: "ap-anakapalli",
		name: "Anakapalli",
		stateCode: "AP"
	},
	{
		id: "ap-ananthapuramu",
		name: "Ananthapuramu",
		stateCode: "AP"
	},
	{
		id: "ap-anantapur",
		name: "Anantapur",
		stateCode: "AP"
	},
	{
		id: "ap-chittoor",
		name: "Chittoor",
		stateCode: "AP"
	},
	{
		id: "ap-east-godavari",
		name: "East Godavari",
		stateCode: "AP"
	},
	{
		id: "ap-guntur",
		name: "Guntur",
		stateCode: "AP"
	},
	{
		id: "ap-kakinada",
		name: "Kakinada",
		stateCode: "AP"
	},
	{
		id: "ap-krishna",
		name: "Krishna",
		stateCode: "AP"
	},
	{
		id: "ap-kurnool",
		name: "Kurnool",
		stateCode: "AP"
	},
	{
		id: "ap-nandyal",
		name: "Nandyal",
		stateCode: "AP"
	},
	{
		id: "ap-prakasam",
		name: "Prakasam",
		stateCode: "AP"
	},
	{
		id: "ap-sri-potti-sriramulu-nellore",
		name: "Sri Potti Sriramulu Nellore",
		stateCode: "AP"
	},
	{
		id: "ap-srikakulam",
		name: "Srikakulam",
		stateCode: "AP"
	},
	{
		id: "ap-tirupati",
		name: "Tirupati",
		stateCode: "AP"
	},
	{
		id: "ap-visakhapatnam",
		name: "Visakhapatnam",
		stateCode: "AP"
	},
	{
		id: "ap-vizianagaram",
		name: "Vizianagaram",
		stateCode: "AP"
	},
	{
		id: "ap-west-godavari",
		name: "West Godavari",
		stateCode: "AP"
	},
	{
		id: "ap-ysr-kadapa",
		name: "YSR Kadapa",
		stateCode: "AP"
	},
	{
		id: "ts-adilabad",
		name: "Adilabad",
		stateCode: "TS"
	},
	{
		id: "ts-bhadradri",
		name: "Bhadradri Kothagudem",
		stateCode: "TS"
	},
	{
		id: "ts-hyderabad",
		name: "Hyderabad",
		stateCode: "TS"
	},
	{
		id: "ts-jagtial",
		name: "Jagtial",
		stateCode: "TS"
	},
	{
		id: "ts-jangaon",
		name: "Jangaon",
		stateCode: "TS"
	},
	{
		id: "ts-jayashankar",
		name: "Jayashankar Bhupalapally",
		stateCode: "TS"
	},
	{
		id: "ts-jogulamba",
		name: "Jogulamba Gadwal",
		stateCode: "TS"
	},
	{
		id: "ts-kamareddy",
		name: "Kamareddy",
		stateCode: "TS"
	},
	{
		id: "ts-karimnagar",
		name: "Karimnagar",
		stateCode: "TS"
	},
	{
		id: "ts-khammam",
		name: "Khammam",
		stateCode: "TS"
	},
	{
		id: "ts-kumuram-bheem",
		name: "Kumuram Bheem",
		stateCode: "TS"
	},
	{
		id: "ts-mahabubabad",
		name: "Mahabubabad",
		stateCode: "TS"
	},
	{
		id: "ts-mahabubnagar",
		name: "Mahabubnagar",
		stateCode: "TS"
	},
	{
		id: "ts-mancherial",
		name: "Mancherial",
		stateCode: "TS"
	},
	{
		id: "ts-medak",
		name: "Medak",
		stateCode: "TS"
	},
	{
		id: "ts-medchal",
		name: "Medchal-Malkajgiri",
		stateCode: "TS"
	},
	{
		id: "ts-mulugu",
		name: "Mulugu",
		stateCode: "TS"
	},
	{
		id: "ts-nagarkurnool",
		name: "Nagarkurnool",
		stateCode: "TS"
	},
	{
		id: "ts-nalgonda",
		name: "Nalgonda",
		stateCode: "TS"
	},
	{
		id: "ts-narayanpet",
		name: "Narayanpet",
		stateCode: "TS"
	},
	{
		id: "ts-nirmal",
		name: "Nirmal",
		stateCode: "TS"
	},
	{
		id: "ts-nizamabad",
		name: "Nizamabad",
		stateCode: "TS"
	},
	{
		id: "ts-peddapalli",
		name: "Peddapalli",
		stateCode: "TS"
	},
	{
		id: "ts-rajanna",
		name: "Rajanna Sircilla",
		stateCode: "TS"
	},
	{
		id: "ts-rangareddy",
		name: "Rangareddy",
		stateCode: "TS"
	},
	{
		id: "ts-sangareddy",
		name: "Sangareddy",
		stateCode: "TS"
	},
	{
		id: "ts-siddipet",
		name: "Siddipet",
		stateCode: "TS"
	},
	{
		id: "ts-suryapet",
		name: "Suryapet",
		stateCode: "TS"
	},
	{
		id: "ts-vikarabad",
		name: "Vikarabad",
		stateCode: "TS"
	},
	{
		id: "ts-wanaparthy",
		name: "Wanaparthy",
		stateCode: "TS"
	},
	{
		id: "ts-warangal-rural",
		name: "Warangal Rural",
		stateCode: "TS"
	},
	{
		id: "ts-warangal-urban",
		name: "Warangal Urban",
		stateCode: "TS"
	},
	{
		id: "ts-yadadri",
		name: "Yadadri Bhuvanagiri",
		stateCode: "TS"
	},
	{
		id: "mp-agar",
		name: "Agar Malwa",
		stateCode: "MP"
	},
	{
		id: "mp-alirajpur",
		name: "Alirajpur",
		stateCode: "MP"
	},
	{
		id: "mp-anuppur",
		name: "Anuppur",
		stateCode: "MP"
	},
	{
		id: "mp-ashoknagar",
		name: "Ashoknagar",
		stateCode: "MP"
	},
	{
		id: "mp-balaghat",
		name: "Balaghat",
		stateCode: "MP"
	},
	{
		id: "mp-barwani",
		name: "Barwani",
		stateCode: "MP"
	},
	{
		id: "mp-betul",
		name: "Betul",
		stateCode: "MP"
	},
	{
		id: "mp-bhind",
		name: "Bhind",
		stateCode: "MP"
	},
	{
		id: "mp-bhopal",
		name: "Bhopal",
		stateCode: "MP"
	},
	{
		id: "mp-burhanpur",
		name: "Burhanpur",
		stateCode: "MP"
	},
	{
		id: "mp-chhatarpur",
		name: "Chhatarpur",
		stateCode: "MP"
	},
	{
		id: "mp-chhindwara",
		name: "Chhindwara",
		stateCode: "MP"
	},
	{
		id: "mp-damoh",
		name: "Damoh",
		stateCode: "MP"
	},
	{
		id: "mp-datia",
		name: "Datia",
		stateCode: "MP"
	},
	{
		id: "mp-dewas",
		name: "Dewas",
		stateCode: "MP"
	},
	{
		id: "mp-dhar",
		name: "Dhar",
		stateCode: "MP"
	},
	{
		id: "mp-dindori",
		name: "Dindori",
		stateCode: "MP"
	},
	{
		id: "mp-guna",
		name: "Guna",
		stateCode: "MP"
	},
	{
		id: "mp-gwalior",
		name: "Gwalior",
		stateCode: "MP"
	},
	{
		id: "mp-hardha",
		name: "Hardha",
		stateCode: "MP"
	},
	{
		id: "mp-hoshangabad",
		name: "Hoshangabad",
		stateCode: "MP"
	},
	{
		id: "mp-indore",
		name: "Indore",
		stateCode: "MP"
	},
	{
		id: "mp-jabalpur",
		name: "Jabalpur",
		stateCode: "MP"
	},
	{
		id: "mp-jhabua",
		name: "Jhabua",
		stateCode: "MP"
	},
	{
		id: "mp-katni",
		name: "Katni",
		stateCode: "MP"
	},
	{
		id: "mp-khandwa",
		name: "Khandwa",
		stateCode: "MP"
	},
	{
		id: "mp-khargone",
		name: "Khargone",
		stateCode: "MP"
	},
	{
		id: "mp-mandla",
		name: "Mandla",
		stateCode: "MP"
	},
	{
		id: "mp-mandsaur",
		name: "Mandsaur",
		stateCode: "MP"
	},
	{
		id: "mp-morena",
		name: "Morena",
		stateCode: "MP"
	},
	{
		id: "mp-narsinghpur",
		name: "Narsinghpur",
		stateCode: "MP"
	},
	{
		id: "mp-neemuch",
		name: "Neemuch",
		stateCode: "MP"
	},
	{
		id: "mp-niwari",
		name: "Niwari",
		stateCode: "MP"
	},
	{
		id: "mp-panna",
		name: "Panna",
		stateCode: "MP"
	},
	{
		id: "mp-raisena",
		name: "Raisena",
		stateCode: "MP"
	},
	{
		id: "mp-rajgarh",
		name: "Rajgarh",
		stateCode: "MP"
	},
	{
		id: "mp-ratlam",
		name: "Ratlam",
		stateCode: "MP"
	},
	{
		id: "mp-rewa",
		name: "Rewa",
		stateCode: "MP"
	},
	{
		id: "mp-sagar",
		name: "Sagar",
		stateCode: "MP"
	},
	{
		id: "mp-satna",
		name: "Satna",
		stateCode: "MP"
	},
	{
		id: "mp-sehore",
		name: "Sehore",
		stateCode: "MP"
	},
	{
		id: "mp-seoni",
		name: "Seoni",
		stateCode: "MP"
	},
	{
		id: "mp-shahdol",
		name: "Shahdol",
		stateCode: "MP"
	},
	{
		id: "mp-shajapur",
		name: "Shajapur",
		stateCode: "MP"
	},
	{
		id: "mp-sheopur",
		name: "Sheopur",
		stateCode: "MP"
	},
	{
		id: "mp-shivpuri",
		name: "Shivpuri",
		stateCode: "MP"
	},
	{
		id: "mp-sidhi",
		name: "Sidhi",
		stateCode: "MP"
	},
	{
		id: "mp-singrauli",
		name: "Singrauli",
		stateCode: "MP"
	},
	{
		id: "mp-tikamgarh",
		name: "Tikamgarh",
		stateCode: "MP"
	},
	{
		id: "mp-ujjain",
		name: "Ujjain",
		stateCode: "MP"
	},
	{
		id: "mp-umaria",
		name: "Umaria",
		stateCode: "MP"
	},
	{
		id: "mp-vidisha",
		name: "Vidisha",
		stateCode: "MP"
	},
	{
		id: "br-araria",
		name: "Araria",
		stateCode: "BR"
	},
	{
		id: "br-arwal",
		name: "Arwal",
		stateCode: "BR"
	},
	{
		id: "br-aurangabad",
		name: "Aurangabad",
		stateCode: "BR"
	},
	{
		id: "br-banka",
		name: "Banka",
		stateCode: "BR"
	},
	{
		id: "br-begusarai",
		name: "Begusarai",
		stateCode: "BR"
	},
	{
		id: "br-bhagalpur",
		name: "Bhagalpur",
		stateCode: "BR"
	},
	{
		id: "br-bhojpur",
		name: "Bhojpur",
		stateCode: "BR"
	},
	{
		id: "br-buxar",
		name: "Buxar",
		stateCode: "BR"
	},
	{
		id: "br-darbhanga",
		name: "Darbhanga",
		stateCode: "BR"
	},
	{
		id: "br-east-champaran",
		name: "East Champaran",
		stateCode: "BR"
	},
	{
		id: "br-gaya",
		name: "Gaya",
		stateCode: "BR"
	},
	{
		id: "br-gopalganj",
		name: "Gopalganj",
		stateCode: "BR"
	},
	{
		id: "br-jamui",
		name: "Jamui",
		stateCode: "BR"
	},
	{
		id: "br-jehanabad",
		name: "Jehanabad",
		stateCode: "BR"
	},
	{
		id: "br-kaimur",
		name: "Kaimur",
		stateCode: "BR"
	},
	{
		id: "br-katihar",
		name: "Katihar",
		stateCode: "BR"
	},
	{
		id: "br-khagaria",
		name: "Khagaria",
		stateCode: "BR"
	},
	{
		id: "br-kishanganj",
		name: "Kishanganj",
		stateCode: "BR"
	},
	{
		id: "br-lakhisarai",
		name: "Lakhisarai",
		stateCode: "BR"
	},
	{
		id: "br-madhepura",
		name: "Madhepura",
		stateCode: "BR"
	},
	{
		id: "br-madhubani",
		name: "Madhubani",
		stateCode: "BR"
	},
	{
		id: "br-munger",
		name: "Munger",
		stateCode: "BR"
	},
	{
		id: "br-muzaffarpur",
		name: "Muzaffarpur",
		stateCode: "BR"
	},
	{
		id: "br-nalanda",
		name: "Nalanda",
		stateCode: "BR"
	},
	{
		id: "br-nawada",
		name: "Nawada",
		stateCode: "BR"
	},
	{
		id: "br-patna",
		name: "Patna",
		stateCode: "BR"
	},
	{
		id: "br-purnia",
		name: "Purnia",
		stateCode: "BR"
	},
	{
		id: "br-rohtas",
		name: "Rohtas",
		stateCode: "BR"
	},
	{
		id: "br-saharsa",
		name: "Saharsa",
		stateCode: "BR"
	},
	{
		id: "br-samastipur",
		name: "Samastipur",
		stateCode: "BR"
	},
	{
		id: "br-saran",
		name: "Saran",
		stateCode: "BR"
	},
	{
		id: "br-sheikhpura",
		name: "Sheikhpura",
		stateCode: "BR"
	},
	{
		id: "br-sheohar",
		name: "Sheohar",
		stateCode: "BR"
	},
	{
		id: "br-sitamarhi",
		name: "Sitamarhi",
		stateCode: "BR"
	},
	{
		id: "br-siwan",
		name: "Siwan",
		stateCode: "BR"
	},
	{
		id: "br-supaul",
		name: "Supaul",
		stateCode: "BR"
	},
	{
		id: "br-vaishali",
		name: "Vaishali",
		stateCode: "BR"
	},
	{
		id: "br-west-champaran",
		name: "West Champaran",
		stateCode: "BR"
	},
	{
		id: "pb-amritsar",
		name: "Amritsar",
		stateCode: "PB"
	},
	{
		id: "pb-barnala",
		name: "Barnala",
		stateCode: "PB"
	},
	{
		id: "pb-bathinda",
		name: "Bathinda",
		stateCode: "PB"
	},
	{
		id: "pb-faridkot",
		name: "Faridkot",
		stateCode: "PB"
	},
	{
		id: "pb-fatehgarh-sahib",
		name: "Fatehgarh Sahib",
		stateCode: "PB"
	},
	{
		id: "pb-fazilka",
		name: "Fazilka",
		stateCode: "PB"
	},
	{
		id: "pb-ferozepur",
		name: "Ferozepur",
		stateCode: "PB"
	},
	{
		id: "pb-gurdaspur",
		name: "Gurdaspur",
		stateCode: "PB"
	},
	{
		id: "pb-hoshiarpur",
		name: "Hoshiarpur",
		stateCode: "PB"
	},
	{
		id: "pb-jalandhar",
		name: "Jalandhar",
		stateCode: "PB"
	},
	{
		id: "pb-kapurthala",
		name: "Kapurthala",
		stateCode: "PB"
	},
	{
		id: "pb-ludhiana",
		name: "Ludhiana",
		stateCode: "PB"
	},
	{
		id: "pb-mansa",
		name: "Mansa",
		stateCode: "PB"
	},
	{
		id: "pb-moga",
		name: "Moga",
		stateCode: "PB"
	},
	{
		id: "pb-mohali",
		name: "SAS Nagar (Mohali)",
		stateCode: "PB"
	},
	{
		id: "pb-muktsar",
		name: "Sri Muktsar Sahib",
		stateCode: "PB"
	},
	{
		id: "pb-pathankot",
		name: "Pathankot",
		stateCode: "PB"
	},
	{
		id: "pb-patiala",
		name: "Patiala",
		stateCode: "PB"
	},
	{
		id: "pb-rupnagar",
		name: "Rupnagar",
		stateCode: "PB"
	},
	{
		id: "pb-sangrur",
		name: "Sangrur",
		stateCode: "PB"
	},
	{
		id: "pb-shaheed-bhagat-singh-nagar",
		name: "Shaheed Bhagat Singh Nagar",
		stateCode: "PB"
	},
	{
		id: "pb-tarn-taran",
		name: "Tarn Taran",
		stateCode: "PB"
	},
	{
		id: "hr-ambala",
		name: "Ambala",
		stateCode: "HR"
	},
	{
		id: "hr-bhiwani",
		name: "Bhiwani",
		stateCode: "HR"
	},
	{
		id: "hr-charkhi-dadri",
		name: "Charkhi Dadri",
		stateCode: "HR"
	},
	{
		id: "hr-faridabad",
		name: "Faridabad",
		stateCode: "HR"
	},
	{
		id: "hr-fatehabad",
		name: "Fatehabad",
		stateCode: "HR"
	},
	{
		id: "hr-gurugram",
		name: "Gurugram",
		stateCode: "HR"
	},
	{
		id: "hr-hisar",
		name: "Hisar",
		stateCode: "HR"
	},
	{
		id: "hr-jhajjar",
		name: "Jhajjar",
		stateCode: "HR"
	},
	{
		id: "hr-jind",
		name: "Jind",
		stateCode: "HR"
	},
	{
		id: "hr-kaithal",
		name: "Kaithal",
		stateCode: "HR"
	},
	{
		id: "hr-karnal",
		name: "Karnal",
		stateCode: "HR"
	},
	{
		id: "hr-kukshetra",
		name: "Kurukshetra",
		stateCode: "HR"
	},
	{
		id: "hr-mahendragarh",
		name: "Mahendragarh",
		stateCode: "HR"
	},
	{
		id: "hr-nuh",
		name: "Nuh",
		stateCode: "HR"
	},
	{
		id: "hr-palwal",
		name: "Palwal",
		stateCode: "HR"
	},
	{
		id: "hr-panchkula",
		name: "Panchkula",
		stateCode: "HR"
	},
	{
		id: "hr-panipat",
		name: "Panipat",
		stateCode: "HR"
	},
	{
		id: "hr-rewari",
		name: "Rewari",
		stateCode: "HR"
	},
	{
		id: "hr-rohtak",
		name: "Rohtak",
		stateCode: "HR"
	},
	{
		id: "hr-sirsa",
		name: "Sirsa",
		stateCode: "HR"
	},
	{
		id: "hr-sonipat",
		name: "Sonipat",
		stateCode: "HR"
	},
	{
		id: "hr-yamunanagar",
		name: "Yamunanagar",
		stateCode: "HR"
	},
	{
		id: "kl-alappuzha",
		name: "Alappuzha",
		stateCode: "KL"
	},
	{
		id: "kl-ernakulam",
		name: "Ernakulam",
		stateCode: "KL"
	},
	{
		id: "kl-idukki",
		name: "Idukki",
		stateCode: "KL"
	},
	{
		id: "kl-kannur",
		name: "Kannur",
		stateCode: "KL"
	},
	{
		id: "kl-kasaragod",
		name: "Kasaragod",
		stateCode: "KL"
	},
	{
		id: "kl-kollam",
		name: "Kollam",
		stateCode: "KL"
	},
	{
		id: "kl-kottayam",
		name: "Kottayam",
		stateCode: "KL"
	},
	{
		id: "kl-kozhikode",
		name: "Kozhikode",
		stateCode: "KL"
	},
	{
		id: "kl-malappuram",
		name: "Malappuram",
		stateCode: "KL"
	},
	{
		id: "kl-palakkad",
		name: "Palakkad",
		stateCode: "KL"
	},
	{
		id: "kl-pathanamthitta",
		name: "Pathanamthitta",
		stateCode: "KL"
	},
	{
		id: "kl-thiruvananthapuram",
		name: "Thiruvananthapuram",
		stateCode: "KL"
	},
	{
		id: "kl-thrissur",
		name: "Thrissur",
		stateCode: "KL"
	},
	{
		id: "kl-wayanad",
		name: "Wayanad",
		stateCode: "KL"
	},
	{
		id: "od-angul",
		name: "Angul",
		stateCode: "OD"
	},
	{
		id: "od-balangir",
		name: "Balangir",
		stateCode: "OD"
	},
	{
		id: "od-balasore",
		name: "Balasore",
		stateCode: "OD"
	},
	{
		id: "od-bargarh",
		name: "Bargarh",
		stateCode: "OD"
	},
	{
		id: "od-bhadrak",
		name: "Bhadrak",
		stateCode: "OD"
	},
	{
		id: "od-boudh",
		name: "Boudh",
		stateCode: "OD"
	},
	{
		id: "od-cuttack",
		name: "Cuttack",
		stateCode: "OD"
	},
	{
		id: "od-deogarh",
		name: "Deogarh",
		stateCode: "OD"
	},
	{
		id: "od-dhenkanal",
		name: "Dhenkanal",
		stateCode: "OD"
	},
	{
		id: "od-gajapati",
		name: "Gajapati",
		stateCode: "OD"
	},
	{
		id: "od-ganjam",
		name: "Ganjam",
		stateCode: "OD"
	},
	{
		id: "od-jagatsinghpur",
		name: "Jagatsinghpur",
		stateCode: "OD"
	},
	{
		id: "od-jajpur",
		name: "Jajpur",
		stateCode: "OD"
	},
	{
		id: "od-jharsuguda",
		name: "Jharsuguda",
		stateCode: "OD"
	},
	{
		id: "od-kalahandi",
		name: "Kalahandi",
		stateCode: "OD"
	},
	{
		id: "od-kandhamal",
		name: "Kandhamal",
		stateCode: "OD"
	},
	{
		id: "od-kendrapara",
		name: "Kendrapara",
		stateCode: "OD"
	},
	{
		id: "od-kendujhar",
		name: "Kendujhar",
		stateCode: "OD"
	},
	{
		id: "od-khurda",
		name: "Khurda",
		stateCode: "OD"
	},
	{
		id: "od-koraput",
		name: "Koraput",
		stateCode: "OD"
	},
	{
		id: "od-malkangiri",
		name: "Malkangiri",
		stateCode: "OD"
	},
	{
		id: "od-mayurbhanj",
		name: "Mayurbhanj",
		stateCode: "OD"
	},
	{
		id: "od-nabarangpur",
		name: "Nabarangpur",
		stateCode: "OD"
	},
	{
		id: "od-nayagarh",
		name: "Nayagarh",
		stateCode: "OD"
	},
	{
		id: "od-nuapada",
		name: "Nuapada",
		stateCode: "OD"
	},
	{
		id: "od-puri",
		name: "Puri",
		stateCode: "OD"
	},
	{
		id: "od-rayagada",
		name: "Rayagada",
		stateCode: "OD"
	},
	{
		id: "od-sambalpur",
		name: "Sambalpur",
		stateCode: "OD"
	},
	{
		id: "od-subarnapur",
		name: "Subarnapur",
		stateCode: "OD"
	},
	{
		id: "od-sundergarh",
		name: "Sundergarh",
		stateCode: "OD"
	},
	{
		id: "as-baksa",
		name: "Baksa",
		stateCode: "AS"
	},
	{
		id: "as-barpeta",
		name: "Barpeta",
		stateCode: "AS"
	},
	{
		id: "as-biswanath",
		name: "Biswanath",
		stateCode: "AS"
	},
	{
		id: "as-cachar",
		name: "Cachar",
		stateCode: "AS"
	},
	{
		id: "as-charaideo",
		name: "Charaideo",
		stateCode: "AS"
	},
	{
		id: "as-chirang",
		name: "Chirang",
		stateCode: "AS"
	},
	{
		id: "as-darrang",
		name: "Darrang",
		stateCode: "AS"
	},
	{
		id: "as-dhemaji",
		name: "Dhemaji",
		stateCode: "AS"
	},
	{
		id: "as-dhubri",
		name: "Dhubri",
		stateCode: "AS"
	},
	{
		id: "as-dibrugarh",
		name: "Dibrugarh",
		stateCode: "AS"
	},
	{
		id: "as-dima-hasao",
		name: "Dima Hasao",
		stateCode: "AS"
	},
	{
		id: "as-goalpara",
		name: "Goalpara",
		stateCode: "AS"
	},
	{
		id: "as-golaghat",
		name: "Golaghat",
		stateCode: "AS"
	},
	{
		id: "as-hailakandi",
		name: "Hailakandi",
		stateCode: "AS"
	},
	{
		id: "as-hojai",
		name: "Hojai",
		stateCode: "AS"
	},
	{
		id: "as-jorhat",
		name: "Jorhat",
		stateCode: "AS"
	},
	{
		id: "as-kamrup",
		name: "Kamrup",
		stateCode: "AS"
	},
	{
		id: "as-kamrup-metro",
		name: "Kamrup Metro",
		stateCode: "AS"
	},
	{
		id: "as-karbi-anglong",
		name: "Karbi Anglong",
		stateCode: "AS"
	},
	{
		id: "as-karimganj",
		name: "Karimganj",
		stateCode: "AS"
	},
	{
		id: "as-kokrajhar",
		name: "Kokrajhar",
		stateCode: "AS"
	},
	{
		id: "as-lakhimpur",
		name: "Lakhimpur",
		stateCode: "AS"
	},
	{
		id: "as-majuli",
		name: "Majuli",
		stateCode: "AS"
	},
	{
		id: "as-marigaon",
		name: "Marigaon",
		stateCode: "AS"
	},
	{
		id: "as-nagaon",
		name: "Nagaon",
		stateCode: "AS"
	},
	{
		id: "as-nalbari",
		name: "Nalbari",
		stateCode: "AS"
	},
	{
		id: "as-sivasagar",
		name: "Sivasagar",
		stateCode: "AS"
	},
	{
		id: "as-sonitpur",
		name: "Sonitpur",
		stateCode: "AS"
	},
	{
		id: "as-south-salmara",
		name: "South Salmara Mankachar",
		stateCode: "AS"
	},
	{
		id: "as-tinsukia",
		name: "Tinsukia",
		stateCode: "AS"
	},
	{
		id: "as-udalguri",
		name: "Udalguri",
		stateCode: "AS"
	},
	{
		id: "as-west-karbi-anglong",
		name: "West Karbi Anglong",
		stateCode: "AS"
	},
	{
		id: "jh-bokaro",
		name: "Bokaro",
		stateCode: "JH"
	},
	{
		id: "jh-chatara",
		name: "Chatara",
		stateCode: "JH"
	},
	{
		id: "jh-deoghar",
		name: "Deoghar",
		stateCode: "JH"
	},
	{
		id: "jh-dhanbad",
		name: "Dhanbad",
		stateCode: "JH"
	},
	{
		id: "jh-dumka",
		name: "Dumka",
		stateCode: "JH"
	},
	{
		id: "jh-east-singhbhum",
		name: "East Singhbhum",
		stateCode: "JH"
	},
	{
		id: "jh-garhwa",
		name: "Garhwa",
		stateCode: "JH"
	},
	{
		id: "jh-giridih",
		name: "Giridih",
		stateCode: "JH"
	},
	{
		id: "jh-godda",
		name: "Godda",
		stateCode: "JH"
	},
	{
		id: "jh-gumla",
		name: "Gumla",
		stateCode: "JH"
	},
	{
		id: "jh-hazaribagh",
		name: "Hazaribagh",
		stateCode: "JH"
	},
	{
		id: "jh-jamtara",
		name: "Jamtara",
		stateCode: "JH"
	},
	{
		id: "jh-khunti",
		name: "Khunti",
		stateCode: "JH"
	},
	{
		id: "jh-koderma",
		name: "Koderma",
		stateCode: "JH"
	},
	{
		id: "jh-latehar",
		name: "Latehar",
		stateCode: "JH"
	},
	{
		id: "jh-lohardaga",
		name: "Lohardaga",
		stateCode: "JH"
	},
	{
		id: "jh-pakur",
		name: "Pakur",
		stateCode: "JH"
	},
	{
		id: "jh-palamu",
		name: "Palamu",
		stateCode: "JH"
	},
	{
		id: "jh-ramgarh",
		name: "Ramgarh",
		stateCode: "JH"
	},
	{
		id: "jh-ranchi",
		name: "Ranchi",
		stateCode: "JH"
	},
	{
		id: "jh-sahibganj",
		name: "Sahibganj",
		stateCode: "JH"
	},
	{
		id: "jh-saraikela",
		name: "Saraikela Kharsawan",
		stateCode: "JH"
	},
	{
		id: "jh-simdega",
		name: "Simdega",
		stateCode: "JH"
	},
	{
		id: "jh-west-singhbhum",
		name: "West Singhbhum",
		stateCode: "JH"
	},
	{
		id: "cg-bilaspur",
		name: "Bilaspur",
		stateCode: "CG"
	},
	{
		id: "cg-durg",
		name: "Durg",
		stateCode: "CG"
	},
	{
		id: "cg-raipur",
		name: "Raipur",
		stateCode: "CG"
	},
	{
		id: "cg-raigarh",
		name: "Raigarh",
		stateCode: "CG"
	},
	{
		id: "cg-bastar",
		name: "Bastar",
		stateCode: "CG"
	},
	{
		id: "rj-jalore",
		name: "Jalore",
		stateCode: "RJ"
	},
	{
		id: "rj-jhalawar",
		name: "Jhalawar",
		stateCode: "RJ"
	},
	{
		id: "rj-karauli",
		name: "Karauli",
		stateCode: "RJ"
	},
	{
		id: "rj-pratapgarh",
		name: "Pratapgarh",
		stateCode: "RJ"
	},
	{
		id: "rj-sawai-madhopur",
		name: "Sawai Madhopur",
		stateCode: "RJ"
	},
	{
		id: "rj-sriganganagar",
		name: "Sri Ganganagar",
		stateCode: "RJ"
	},
	{
		id: "uk-almora",
		name: "Almora",
		stateCode: "UK"
	},
	{
		id: "uk-bageshwar",
		name: "Bageshwar",
		stateCode: "UK"
	},
	{
		id: "uk-chamoli",
		name: "Chamoli",
		stateCode: "UK"
	},
	{
		id: "uk-champawat",
		name: "Champawat",
		stateCode: "UK"
	},
	{
		id: "uk-dehradun",
		name: "Dehradun",
		stateCode: "UK"
	},
	{
		id: "uk-haridwar",
		name: "Haridwar",
		stateCode: "UK"
	},
	{
		id: "uk-nainital",
		name: "Nainital",
		stateCode: "UK"
	},
	{
		id: "uk-pauri-garhwal",
		name: "Pauri Garhwal",
		stateCode: "UK"
	},
	{
		id: "uk-pithoragarh",
		name: "Pithoragarh",
		stateCode: "UK"
	},
	{
		id: "uk-rudraprayag",
		name: "Rudraprayag",
		stateCode: "UK"
	},
	{
		id: "uk-tehri-garhwal",
		name: "Tehri Garhwal",
		stateCode: "UK"
	},
	{
		id: "uk-udam-singh-nagar",
		name: "Udham Singh Nagar",
		stateCode: "UK"
	},
	{
		id: "uk-uttarkashi",
		name: "Uttarkashi",
		stateCode: "UK"
	},
	{
		id: "hp-bilaspur",
		name: "Bilaspur",
		stateCode: "HP"
	},
	{
		id: "hp-chamba",
		name: "Chamba",
		stateCode: "HP"
	},
	{
		id: "hp-hamirpur",
		name: "Hamirpur",
		stateCode: "HP"
	},
	{
		id: "hp-kangra",
		name: "Kangra",
		stateCode: "HP"
	},
	{
		id: "hp-kinnaur",
		name: "Kinnaur",
		stateCode: "HP"
	},
	{
		id: "hp-kullu",
		name: "Kullu",
		stateCode: "HP"
	},
	{
		id: "hp-lahul-spiti",
		name: "Lahul and Spiti",
		stateCode: "HP"
	},
	{
		id: "hp-mandi",
		name: "Mandi",
		stateCode: "HP"
	},
	{
		id: "hp-shimla",
		name: "Shimla",
		stateCode: "HP"
	},
	{
		id: "hp-sirmaur",
		name: "Sirmaur",
		stateCode: "HP"
	},
	{
		id: "hp-solan",
		name: "Solan",
		stateCode: "HP"
	},
	{
		id: "hp-una",
		name: "Una",
		stateCode: "HP"
	}
];
function getCitiesByState(stateCode) {
	return INDIAN_CITIES.filter((c) => c.stateCode === stateCode);
}
function getStateCodeByName(name) {
	const normalized = name.toLowerCase().trim();
	return INDIAN_STATES.find((s) => s.name.toLowerCase() === normalized)?.code;
}
function getStateNameByCode(code) {
	return INDIAN_STATES.find((s) => s.code === code)?.name || code;
}
function toPaise(n) {
	return Math.round(n * 100);
}
function fromPaise(p) {
	return p / 100;
}
function calculateTotals(input) {
	const tax = input.taxSettings || DEFAULT_TAX_SETTINGS;
	const delivery = input.deliveryConfig || DEFAULT_DELIVERY;
	const deliveryInfo = input.deliveryMethod === "express" ? delivery.express : delivery.standard;
	const shippingCharge = deliveryInfo.charge;
	const itemsSubtotal = input.subtotal;
	const productDiscount = 0;
	const couponDiscount = input.couponDiscount;
	const afterDiscount = itemsSubtotal - couponDiscount - productDiscount;
	const now = /* @__PURE__ */ new Date();
	const estDays = input.deliveryMethod === "express" ? [1, 2] : [3, 5];
	const fmtDate = (d) => d.toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short"
	});
	if (!tax.enabled) {
		const rawTotal = afterDiscount + shippingCharge;
		return {
			itemsSubtotal,
			productDiscount,
			couponDiscount,
			shippingCharge,
			shippingMethod: input.deliveryMethod,
			taxableAmount: rawTotal,
			gstType: "igst",
			cgstRate: 0,
			sgstRate: 0,
			igstRate: 0,
			cgstAmount: 0,
			sgstAmount: 0,
			igstAmount: 0,
			gstAmount: 0,
			roundingAdjustment: 0,
			grandTotal: Math.round(rawTotal * 100) / 100,
			deliveryLabel: deliveryInfo.label,
			deliveryDays: deliveryInfo.days,
			deliveryEstimate: `${fmtDate(new Date(Date.now() + estDays[0] * 864e5))}–${fmtDate(new Date(Date.now() + estDays[1] * 864e5))}`
		};
	}
	const businessStateCode = tax.businessStateCode;
	const gstType = (input.deliveryStateCode || "") === businessStateCode ? "cgst_sgst" : "igst";
	let taxableBase = afterDiscount + (tax.applyGstToShipping ? shippingCharge : 0);
	let cgstAmount = 0;
	let sgstAmount = 0;
	let igstAmount = 0;
	let gstAmount = 0;
	if (tax.mode === "inclusive") {
		const inclusiveRate = tax.defaultRate / 100;
		const taxablePaise = toPaise(taxableBase);
		const extractedPaise = taxablePaise - Math.round(taxablePaise / (1 + inclusiveRate));
		gstAmount = fromPaise(extractedPaise);
		if (gstType === "cgst_sgst") {
			cgstAmount = fromPaise(Math.round(extractedPaise / 2));
			sgstAmount = gstAmount - cgstAmount;
		} else igstAmount = gstAmount;
	} else {
		const taxablePaise = toPaise(taxableBase);
		if (gstType === "cgst_sgst") {
			cgstAmount = fromPaise(Math.round(taxablePaise * tax.cgstRate / 100));
			sgstAmount = fromPaise(Math.round(taxablePaise * tax.sgstRate / 100));
			gstAmount = cgstAmount + sgstAmount;
		} else {
			igstAmount = fromPaise(Math.round(taxablePaise * tax.igstRate / 100));
			gstAmount = igstAmount;
		}
	}
	const totalPaise = toPaise(afterDiscount) + toPaise(shippingCharge) + toPaise(gstAmount);
	const roundingAdjustment = fromPaise(Math.round(totalPaise)) - afterDiscount - shippingCharge - gstAmount;
	const grandTotal = fromPaise(Math.round(totalPaise));
	const estStart = new Date(now);
	estStart.setDate(estStart.getDate() + estDays[0]);
	const estEnd = new Date(now);
	estEnd.setDate(estEnd.getDate() + estDays[1]);
	return {
		itemsSubtotal,
		productDiscount,
		couponDiscount,
		shippingCharge,
		shippingMethod: input.deliveryMethod,
		taxableAmount: taxableBase,
		gstType,
		cgstRate: tax.cgstRate,
		sgstRate: tax.sgstRate,
		igstRate: tax.igstRate,
		cgstAmount: Math.round(cgstAmount * 100) / 100,
		sgstAmount: Math.round(sgstAmount * 100) / 100,
		igstAmount: Math.round(igstAmount * 100) / 100,
		gstAmount: Math.round(gstAmount * 100) / 100,
		roundingAdjustment: Math.round(roundingAdjustment * 100) / 100,
		grandTotal: Math.round(grandTotal * 100) / 100,
		deliveryLabel: deliveryInfo.label,
		deliveryDays: deliveryInfo.days,
		deliveryEstimate: `${fmtDate(estStart)}–${fmtDate(estEnd)}`
	};
}
var db = () => supabase;
var adb = () => storefrontSupabase;
async function validateCouponScope(couponId, items) {
	const { data: coupon } = await supabase.from("coupons").select("coupon_scope").eq("id", couponId).maybeSingle();
	const scope = coupon?.coupon_scope || "entire_store";
	if (scope === "entire_store" || !items || items.length === 0) return {
		valid: true,
		message: ""
	};
	const { data: scopes } = await supabase.from("coupon_scopes").select("scope_type, scope_id").eq("coupon_id", couponId);
	if (!scopes || scopes.length === 0) return {
		valid: false,
		message: "This coupon does not apply to any products."
	};
	const cartSlugs = items.map((i) => i.productId);
	const { data: productRows } = await supabase.from("products").select("id, slug").in("slug", cartSlugs);
	const slugToUuid = new Map((productRows || []).map((p) => [p.slug, p.id]));
	const cartUuids = cartSlugs.map((slug) => slugToUuid.get(slug)).filter(Boolean);
	console.log("[CouponScope] Coupon ID:", couponId);
	console.log("[CouponScope] Scope:", scope);
	console.log("[CouponScope] Scopes from DB:", JSON.stringify(scopes));
	console.log("[CouponScope] Cart slugs:", cartSlugs);
	console.log("[CouponScope] Mapped cart UUIDs:", cartUuids);
	if (scope === "selected_products") {
		const validProductIds = new Set(scopes.filter((s) => s.scope_type === "product" && s.scope_id).map((s) => s.scope_id));
		console.log("[CouponScope] Valid product UUIDs (from scopes):", [...validProductIds]);
		const applies = cartUuids.some((uuid) => validProductIds.has(uuid));
		console.log("[CouponScope] Matching products found:", applies);
		if (!applies) return {
			valid: false,
			message: "This coupon does not apply to any items in your cart."
		};
		return {
			valid: true,
			message: ""
		};
	}
	if (scope === "selected_categories") {
		const validCategoryIds = new Set(scopes.filter((s) => s.scope_type === "category" && s.scope_id).map((s) => s.scope_id));
		console.log("[CouponScope] Valid category IDs (from scopes):", [...validCategoryIds]);
		const { data: productCategories } = await supabase.from("product_categories").select("product_id, category_id").in("product_id", cartUuids);
		const matching = (productCategories || []).filter((pc) => validCategoryIds.has(pc.category_id));
		console.log("[CouponScope] Matching product_categories rows:", matching);
		if (!(matching.length > 0)) return {
			valid: false,
			message: "This coupon does not apply to any items in your cart."
		};
		return {
			valid: true,
			message: ""
		};
	}
	return {
		valid: true,
		message: ""
	};
}
async function validateCoupon(code, subtotal, items, customerId) {
	const trimmed = code.trim().toUpperCase();
	if (!trimmed) return {
		id: "",
		code: "",
		discountType: "percentage",
		discountValue: 0,
		maxDiscount: 0,
		isValid: false,
		message: "Please enter a coupon code.",
		discountAmount: 0
	};
	const { data: coupon } = await db().from("coupons").select("*").ilike("code", trimmed).maybeSingle();
	if (!coupon) return {
		id: "",
		code: trimmed,
		discountType: "percentage",
		discountValue: 0,
		maxDiscount: 0,
		isValid: false,
		message: "Invalid coupon code.",
		discountAmount: 0
	};
	if (!coupon.is_active) return {
		id: coupon.id,
		code: trimmed,
		discountType: coupon.discount_type,
		discountValue: coupon.discount_value,
		maxDiscount: coupon.max_discount || 0,
		isValid: false,
		message: "This coupon is no longer active.",
		discountAmount: 0
	};
	const now = /* @__PURE__ */ new Date();
	if (coupon.start_date && new Date(coupon.start_date) > now) return {
		id: coupon.id,
		code: trimmed,
		discountType: coupon.discount_type,
		discountValue: coupon.discount_value,
		maxDiscount: coupon.max_discount || 0,
		isValid: false,
		message: "This coupon is not yet valid.",
		discountAmount: 0
	};
	if (coupon.expiry_date && new Date(coupon.expiry_date) < now) return {
		id: coupon.id,
		code: trimmed,
		discountType: coupon.discount_type,
		discountValue: coupon.discount_value,
		maxDiscount: coupon.max_discount || 0,
		isValid: false,
		message: "This coupon has expired.",
		discountAmount: 0
	};
	if (coupon.min_cart_value && subtotal < coupon.min_cart_value) return {
		id: coupon.id,
		code: trimmed,
		discountType: coupon.discount_type,
		discountValue: coupon.discount_value,
		maxDiscount: coupon.max_discount || 0,
		isValid: false,
		message: `Minimum order value is ₹${Number(coupon.min_cart_value).toLocaleString("en-IN")}.`,
		discountAmount: 0
	};
	if (coupon.total_usage_limit && (coupon.usage_count || 0) >= coupon.total_usage_limit) return {
		id: coupon.id,
		code: trimmed,
		discountType: coupon.discount_type,
		discountValue: coupon.discount_value,
		maxDiscount: coupon.max_discount || 0,
		isValid: false,
		message: "This coupon has reached its usage limit.",
		discountAmount: 0
	};
	console.log("[Coupon] Found coupon:", {
		id: coupon.id,
		code: trimmed,
		scope: coupon.coupon_scope,
		discount_type: coupon.discount_type,
		discount_value: coupon.discount_value
	});
	console.log("[Coupon] Cart items:", items);
	if (coupon.discount_type === "percentage" && coupon.discount_value > 100) return {
		id: coupon.id,
		code: trimmed,
		discountType: "percentage",
		discountValue: coupon.discount_value,
		maxDiscount: coupon.max_discount || 0,
		isValid: false,
		message: "Invalid coupon configuration: percentage discount exceeds 100%.",
		discountAmount: 0
	};
	if (items && items.length > 0) {
		const scopeCheck = await validateCouponScope(coupon.id, items);
		console.log("[Coupon] Scope check result:", scopeCheck);
		if (!scopeCheck.valid) return {
			id: coupon.id,
			code: trimmed,
			discountType: coupon.discount_type,
			discountValue: coupon.discount_value,
			maxDiscount: coupon.max_discount || 0,
			isValid: false,
			message: scopeCheck.message,
			discountAmount: 0
		};
	}
	if (customerId && coupon.per_user_usage_limit) {
		const { count } = await db().from("coupon_usage").select("*", {
			count: "exact",
			head: true
		}).eq("coupon_id", coupon.id).eq("customer_id", customerId);
		if (count && count >= coupon.per_user_usage_limit) return {
			id: coupon.id,
			code: trimmed,
			discountType: coupon.discount_type,
			discountValue: coupon.discount_value,
			maxDiscount: coupon.max_discount || 0,
			isValid: false,
			message: "You have already used this coupon.",
			discountAmount: 0
		};
	}
	let discountAmount = coupon.discount_type === "percentage" ? subtotal * coupon.discount_value / 100 : coupon.discount_value;
	if (coupon.max_discount) discountAmount = Math.min(discountAmount, coupon.max_discount);
	return {
		id: coupon.id,
		code: trimmed,
		discountType: coupon.discount_type,
		discountValue: coupon.discount_value,
		maxDiscount: coupon.max_discount || 0,
		isValid: true,
		message: `Coupon applied! You save ₹${Math.round(discountAmount).toLocaleString("en-IN")}.`,
		discountAmount: Math.round(discountAmount)
	};
}
async function validateAndRecalculateTotals(params) {
	const taxSettings = (await db().from("site_settings").select("*").eq("setting_key", "tax_settings").maybeSingle())?.data?.setting_value || DEFAULT_TAX_SETTINGS;
	return calculateTotals({
		subtotal: params.subtotal,
		couponDiscount: params.discountAmount,
		deliveryMethod: params.deliveryMethod,
		deliveryStateCode: params.deliveryStateCode,
		taxSettings
	});
}
async function generateOrderNumber() {
	try {
		const { data, error } = await adb().rpc("generate_order_number");
		if (data && !error) return data;
	} catch {}
	return `CM-${(/* @__PURE__ */ new Date()).getFullYear()}-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}
function buildOrderPayload(orderNumber, checkoutAttemptId, params, overrides) {
	const addr = params.deliveryAddress;
	return {
		order_number: orderNumber,
		checkout_attempt_id: checkoutAttemptId,
		customer_id: params.customerId,
		customer_name: params.customerName,
		customer_email: params.customerEmail,
		customer_phone: params.customerPhone,
		delivery_address: {
			addressLine1: addr.addressLine1,
			addressLine2: addr.addressLine2 || "",
			city: addr.city,
			state: addr.state,
			stateCode: addr.stateCode || "",
			district: addr.district || "",
			postalCode: addr.postalCode,
			pincode: addr.pincode || addr.postalCode,
			locality: addr.locality || "",
			country: addr.country || "India",
			landmark: addr.landmark || "",
			addressType: addr.addressType || "Home"
		},
		delivery_method: params.deliveryMethod,
		delivery_state_code: addr.stateCode || "",
		delivery_city: addr.city,
		delivery_district: addr.district || "",
		delivery_pincode: addr.pincode || addr.postalCode,
		delivery_locality: addr.locality || "",
		delivery_country_code: "IN",
		subtotal: params.subtotal,
		discount_amount: params.discountAmount,
		coupon_code: params.couponCode,
		shipping_amount: overrides?.shipping ?? params.shipping,
		tax_amount: overrides?.tax ?? params.tax,
		total_amount: overrides?.total ?? params.total,
		tax_snapshot: overrides?.taxSnapshot ?? params.taxSnapshot ?? null,
		payment_method: params.paymentMethod,
		payment_status: params.paymentMethod === "cod" ? "pending" : "paid",
		order_status: "confirmed",
		gift_packaging_enabled: params.giftPackagingEnabled || false,
		gift_packaging_price: params.giftPackagingPrice || 0,
		gift_packaging_name: params.giftPackagingName || "",
		gift_message: params.giftMessage || ""
	};
}
async function createOrder(params) {
	try {
		const checkoutAttemptId = params.checkoutAttemptId || crypto.randomUUID();
		const txRef = `DEMO-CM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
		const serverTotals = await validateAndRecalculateTotals({
			subtotal: params.subtotal,
			discountAmount: params.discountAmount,
			deliveryMethod: params.deliveryMethod,
			deliveryStateCode: params.deliveryAddress.stateCode
		});
		const finalAmount = Math.round(serverTotals.grandTotal);
		if (Math.abs(finalAmount - params.total) > 1) console.warn("Client/server total mismatch — using server-calculated amount", {
			client: params.total,
			server: finalAmount
		});
		let orderNumber = await generateOrderNumber();
		const payload = buildOrderPayload(orderNumber, checkoutAttemptId, params, {
			shipping: serverTotals.shippingCharge,
			tax: serverTotals.gstAmount,
			total: finalAmount,
			taxSnapshot: serverTotals
		});
		const { data: createdOrder, error: orderErr } = await adb().from("orders").insert(payload).select().single();
		let order = createdOrder;
		if (orderErr?.code === "23505" && orderErr.message?.includes("orders_order_number")) {
			orderNumber = await generateOrderNumber();
			const retry = await adb().from("orders").insert(buildOrderPayload(orderNumber, checkoutAttemptId, params, {
				shipping: serverTotals.shippingCharge,
				tax: serverTotals.gstAmount,
				total: finalAmount,
				taxSnapshot: serverTotals
			})).select().single();
			if (retry.error || !retry.data) {
				console.error("Order creation retry failed:", retry.error);
				return {
					orderNumber: "",
					orderId: "",
					error: "Your order could not be created. Please try again."
				};
			}
			order = retry.data;
		} else if (orderErr || !order) {
			console.error("Order creation failed:", orderErr);
			return {
				orderNumber: "",
				orderId: "",
				error: orderErr?.message || "Failed to create order"
			};
		}
		const slugs = [...new Set(params.items.map((i) => i.productId))];
		const { data: productRows } = await adb().from("products").select("id, slug").in("slug", slugs);
		const slugToUuid = /* @__PURE__ */ new Map();
		if (productRows) for (const p of productRows) slugToUuid.set(p.slug, p.id);
		const orderItems = params.items.map((item) => ({
			order_id: order.id,
			product_id: slugToUuid.get(item.productId) || item.productId,
			product_name: item.name,
			product_image: item.image,
			quantity: item.qty,
			unit_price: item.unitPrice,
			total_price: item.lineTotal
		}));
		const { error: itemsErr } = await adb().from("order_items").insert(orderItems);
		if (itemsErr) throw new Error(`Failed to create order items: ${itemsErr.message}`);
		const paymentAmount = finalAmount || params.total;
		const { error: payErr } = await adb().from("payments").insert({
			order_id: order.id,
			customer_id: params.customerId,
			payment_method: params.paymentMethod,
			transaction_reference: txRef,
			amount: paymentAmount,
			currency: "INR",
			status: params.paymentMethod === "cod" ? "pending" : "paid",
			is_demo: true,
			safe_metadata: {
				method: params.paymentMethod,
				isDemo: true,
				deliveryMethod: params.deliveryMethod
			}
		});
		if (payErr) throw new Error(`Failed to create payment: ${payErr.message}`);
		try {
			const { data: sessionData } = await storefrontSupabase.auth.getSession();
			const accessToken = sessionData.session?.access_token || "";
			const { data: customer } = await adb().from("customers").select("welcome_email_sent_at, first_order_at").eq("id", params.customerId).maybeSingle();
			if (!customer?.first_order_at) await adb().from("customers").update({ first_order_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", params.customerId);
			if (!customer?.welcome_email_sent_at) sendTransactionalEmail({ data: {
				template: "welcome",
				customerId: params.customerId,
				source: "system",
				accessToken
			} }).catch((err) => console.error("Welcome email failed:", err));
			sendTransactionalEmail({ data: {
				template: "order_confirmation",
				orderId: order.id,
				source: "system",
				accessToken
			} }).catch((err) => console.error("Order confirmation email failed:", err));
		} catch (notificationErr) {
			console.error("Transactional notification scheduling failed:", notificationErr);
		}
		if (params.couponId && params.couponCode) {
			const { error: usageErr } = await adb().from("coupon_usage").insert({
				coupon_id: params.couponId,
				order_id: order.id,
				customer_id: params.customerId,
				discount_amount: params.discountAmount
			});
			if (!usageErr) await adb().from("coupons").update({ usage_count: storefrontSupabase.rpc ? void 0 : void 0 }).eq("id", params.couponId);
		}
		for (const item of params.items) {
			const pid = slugToUuid.get(item.productId) || item.productId;
			const { data: product } = await adb().from("products").select("stock_quantity").eq("id", pid).single();
			if (product && product.stock_quantity != null) {
				const newStock = Math.max(0, product.stock_quantity - item.qty);
				await adb().from("products").update({ stock_quantity: newStock }).eq("id", pid);
			}
		}
		const { error: custErr } = await adb().from("customers").update({
			total_orders: storefrontSupabase.rpc ? void 0 : void 0,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", params.customerId);
		if (custErr) console.error("Failed to update customer stats:", custErr);
		return {
			orderNumber,
			orderId: order.id,
			error: null
		};
	} catch (err) {
		return {
			orderNumber: "",
			orderId: "",
			error: err.message || "Unknown error creating order"
		};
	}
}
async function saveAbandonedCheckout(params) {
	try {
		const { error } = await supabase.from("site_settings").select("setting_key").eq("setting_key", "_checkout_abandoned").limit(1);
		if (error?.code === "42P01") return;
		const { error: insertErr } = await supabase.from("abandoned_checkouts").insert({
			customer_id: params.customerId,
			customer_email: params.customerEmail,
			cart_value: params.cartValue,
			last_step: params.lastStep,
			delivery_pincode: params.deliveryPincode || null,
			delivery_state: params.deliveryState || null,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		if (insertErr) console.error("Failed to save abandoned checkout:", insertErr);
	} catch {}
}
//#endregion
export { getStateCodeByName as a, validateCoupon as c, getCitiesByState as i, calculateTotals as n, getStateNameByCode as o, createOrder as r, saveAbandonedCheckout as s, INDIAN_STATES as t };
