import { Project, Requirement, ComplianceResult, Contradiction, MissingDocument, DocumentItem, ComplianceReport } from './types';

export const CLEAN_BLANK_PROJECT: Project = {
  id: 'proj-clean',
  name: 'Tender Evaluation Workspace',
  tenderId: 'NIT/2026/001',
  organization: 'Procurement Department',
  bidderName: 'Bidder Organization',
  bidderGstin: '',
  tenderDeadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  description: 'Upload tender specifications and bidder dossier to begin evaluation.',
  createdAt: new Date().toISOString(),
  status: 'Draft',
  overallScore: 0,
  categoryScores: {},
  stats: {
    totalRequirements: 0,
    compliant: 0,
    needsReview: 0,
    nonCompliant: 0,
  },
  isDemo: false,
};

export const DEMO_PROJECT: Project = {
  id: 'proj-gem-demo',
  name: 'Supply of Industrial Safety Equipment & Smart Protective Gear',
  tenderId: 'GEM/2026/B/9821430',
  organization: 'NTPC Limited (Ministry of Power / Central PSU)',
  bidderName: 'ABC Industrial Solutions Pvt. Ltd.',
  bidderGstin: '27AAACB9812M1Z5',
  tenderDeadline: '2026-03-25T17:00:00Z',
  description: 'Procurement of High-Altitude Fall Arrest Systems, Flame Retardant Coveralls, NABL-Tested Smart Safety Helmets, and Associated Industrial PPE under GeM Custom Bid.',
  createdAt: '2026-03-01T10:30:00Z',
  status: 'Review Required',
  overallScore: 78,
  categoryScores: {
    Eligibility: 100,
    Financial: 60,
    Experience: 50,
    Technical: 88,
    Certification: 75,
    Documentation: 70,
    Delivery: 100,
    'Legal/Regulatory': 100,
    Other: 85,
  },
  stats: {
    totalRequirements: 25,
    compliant: 18,
    needsReview: 4,
    nonCompliant: 3,
  },
  isDemo: true,
};

export const DEMO_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-t-01',
    projectId: 'proj-gem-demo',
    fileName: 'GeM_Tender_Notice_GEM2026B9821430.pdf',
    category: 'tender',
    type: 'PDF',
    size: '4.8 MB',
    uploadDate: '2026-03-01',
    status: 'Analyzed',
    pageCount: 48,
    relevantRequirementsCount: 17,
    textContent: `GOVERNMENT OF INDIA • MINISTRY OF POWER
CENTRAL PUBLIC SECTOR ENTERPRISE • NTPC LIMITED
BID SOLICITATION NOTICE UNDER GENERAL FINANCIAL RULES (GFR), 2017
Tender Reference Identifier: GEM/2026/B/9821430
GeM Custom Bid Number: GEM/2026/B/9821430-Custom-Rev2

1. PREAMBLE & STATUTORY INVITATION TO BID:
Pursuant to Rule 144, 150, and Rule 161 of the General Financial Rules (GFR), 2017, competitive open bids are hereby invited on the Government e-Marketplace (GeM) portal from eligible, reputable, and competent Indian manufacturers and vendors for the "Supply, Commissioning, and Warranty Maintenance of Industrial Fall Arrest Systems, Flame Retardant Protective Coveralls, Smart Sensor-Equipped Safety Helmets, and Associated High-Altitude Safety Gear" at various NTPC thermal and renewable power stations across India.

2. MANDATORY QUALIFICATION COVENANTS (STRICTISSIMI JURIS):
Clause 3.1 [Financial Solvency & Turnover Threshold]:
The bidder must possess a minimum average annual financial turnover of ₹10.00 Crores (Rupees Ten Crores Only) across the three preceding financial years (FY 2022-23, FY 2023-24, and FY 2024-25). Proof of turnover must be strictly evidenced through Audited Balance Sheets and Profit & Loss Accounts certified under seal by an Independent Practicing Chartered Accountant bearing a verifiable Unique Document Identification Number (UDIN).

Clause 3.2 [Operational Pedigree & Prior Contract Execution]:
The bidder must substantiate an unblemished operational track record of at least 5 (Five) consecutive financial years delivering comparable industrial safety or technical gear to Central/State Public Sector Undertakings (CPSUs), Defence Establishments, or Fortune 500 enterprises. Satisfactory Completion Certificates with contract values must be submitted.

Clause 3.3 [Accreditation & Quality Management]:
Bidders must hold active and unexpired certifications for ISO 9001:2015 (Quality Management System) and ISO 45001:2018 (Occupational Health & Safety) issued by an accreditation body registered under the National Accreditation Board for Certification Bodies (NABCB) or International Accreditation Forum (IAF).

Clause 3.4 [Public Procurement (Make in India) Preference]:
In strict adherence to Department for Promotion of Industry and Internal Trade (DPIIT) Order No. P-45021/2/2017-PP (BE-II) dated 16.09.2020, only Class-I Local Suppliers with verifiable domestic local content exceeding 50% shall be entitled to statutory purchase preference. A statutory declaration executed before a Notary Public is mandatory.

Clause 3.5 [Warranty & Ingress Protection SLA]:
All delivered items must be backed by a comprehensive, non-derogable, 60-month on-site OEM replacement warranty, with maximum 24-hour engineer response time and mandatory compliance with IP68 continuous immersion ingress protection (IEC 60529) tested by an accredited NABL laboratory.`
  },
  {
    id: 'doc-t-02',
    projectId: 'proj-gem-demo',
    fileName: 'Technical_Specifications_Schedule_A.pdf',
    category: 'tender',
    type: 'PDF',
    size: '2.4 MB',
    uploadDate: '2026-03-01',
    status: 'Analyzed',
    pageCount: 22,
    relevantRequirementsCount: 8,
    textContent: `SCHEDULE 'A': STATUTORY TECHNICAL SPECIFICATION DOSSIER & COMPLIANCE MATRIX
Procurement Ref: GEM/2026/B/9821430 • NTPC Central Engineering Services Division

1. TECHNICAL REGULATORY STANDARDS & BENCHMARKS:
Section 1.1: Full-Body Fall Arrest Harnesses:
All fall arrest harnesses must be manufactured from high-tenacity polyester webbing with minimum breaking tensile strength of 25 kN, conforming strictly to Bureau of Indian Standards IS 3521:1999 (Part 1 & 2) and EN 361:2002. Hardware components must possess corrosion resistance tested to ASTM B117 (minimum 720 hours neutral salt spray testing).

Section 1.2: Flame Retardant Industrial Coveralls:
Protective workwear must conform to IS 15841:2010 and EN ISO 11612:2015 (A1+A2, B1, C1, F1). Fabric composition must be inherently flame retardant with arc thermal performance value (ATPV) no less than 8.0 cal/cm² (NFPA 70E Hazard Risk Category 2).

Section 1.3: Smart Sensor Safety Helmets:
Smart protective headgear must feature high-density polyethylene (HDPE) shells conforming to IS 2925:1984 / EN 397:2012 with integrated micro-sensor telemetry bays. Electronic modules must achieve IP68 ingress protection under IEC 60529 (continuous submersion at 1.5m depth for 2 hours) verified by an accredited NABL testing facility.

Section 1.4: Mandatory Testing & Verification Protocol:
Test reports older than 24 months from the tender submission deadline shall be deemed legally non-compliant and discarded without right of cure.`
  },
  {
    id: 'doc-b-01',
    projectId: 'proj-gem-demo',
    fileName: 'Audited_Balance_Sheet_Schedule_3.pdf',
    category: 'bidder',
    type: 'PDF',
    size: '11.2 MB',
    uploadDate: '2026-03-02',
    status: 'Analyzed',
    pageCount: 36,
    relevantRequirementsCount: 4,
    textContent: `INDEPENDENT AUDITOR’S STATUTORY REPORT
To the Members of ABC Industrial Solutions Private Limited
Pursuant to Section 143(3) of the Companies Act, 2013 and Rule 11 of the Companies (Audit and Auditors) Rules, 2014

1. OPINION:
We have audited the accompanying financial statements of ABC Industrial Solutions Private Limited ('the Company'), which comprise the Balance Sheet as at 31st March 2025, the Statement of Profit and Loss for the year then ended, and notes to the financial statements, including a summary of significant accounting policies and other explanatory information.

In our opinion and to the best of our information and according to the explanations given to us, the aforesaid financial statements give the information required by the Companies Act, 2013 in the manner so required and give a true and fair view in conformity with the Indian Accounting Standards (Ind AS) prescribed under Section 133 of the Act read with the Companies (Indian Accounting Standards) Rules, 2015:
(a) In the case of the Balance Sheet, of the state of affairs of the Company as at 31st March 2025; and
(b) In the case of the Statement of Profit and Loss, of the profit for the year ended on that date.

2. SUBSTANTIVE FINANCIAL QUANTITATIVE EXTRACTS:
Particulars for Financial Year Ended 31st March 2025 (FY 2024-25):
• Gross Revenue from Core Manufacturing Operations: ₹7,20,45,000/- (Rupees Seven Crores Twenty Lakhs Forty-Five Thousand Only)
• Other Operating Income: ₹14,80,000/-
• Profit Before Exceptional Items and Tax: ₹64,20,000/-
• Current Paid-Up Equity Share Capital: ₹1,50,000,00/-
• Tangible Net Worth as per Section 2(57) of Companies Act: ₹4,80,00,000/- (Rupees Four Crores Eighty Lakhs Only)

Signed under our seal at Mumbai, Maharashtra this 28th day of June 2025.
For M/s R.K. Singhania & Associates, Chartered Accountants (Firm Reg. No: 014289N)
CA. Rajesh K. Singhania, Senior Partner (M. No: 088219) • UDIN: 25088219AAAAAF1029`
  },
  {
    id: 'doc-b-02',
    projectId: 'proj-gem-demo',
    fileName: 'CA_Networth_Turnover_Certificate.pdf',
    category: 'bidder',
    type: 'PDF',
    size: '1.2 MB',
    uploadDate: '2026-03-02',
    status: 'Analyzed',
    pageCount: 4,
    relevantRequirementsCount: 3,
    textContent: `R.K. SINGHANIA & ASSOCIATES • CHARTERED ACCOUNTANTS
Head Office: 402, Nariman Point Commercial Chambers, Mumbai 400021
Phone: +91 22 2288 1900 • Email: compliance@rksinghania.com

STATUTORY TURNOVER AND NET WORTH CERTIFICATE
(ISSUED FOR SUBMISSION TO GOVERNMENT E-MARKETPLACE / NTPC LIMITED)
Unique Document Identification Number (UDIN): 25088219AKLM9912

TO WHOMSOEVER IT MAY CONCERN:
This is to certify that on the basis of our examination of the audited books of accounts, statutory returns, and managerial representation letters of M/s ABC Industrial Solutions Private Limited (CIN: U28999MH2023PTC398120), having its registered office at Plot 44-B, Chakan Industrial Area Phase II, Pune 410501:

1. The Annual Turnover of the Bidder entity for the preceding Financial Year 2024-25 is certified as under:
• FY 2024-25 Gross Consolidated Turnover: ₹12,40,00,000/- (Rupees Twelve Crores Forty Lakhs Only).
[Explanatory Note: The above consolidated figure incorporates ₹7.20 Crore generated from core industrial safety manufacturing and ₹5.20 Crore derived through wholesale mercantile division trading of third-party auxiliary electrical goods].

2. The Computed Net Worth of the Company as on 31st March 2025 stands at ₹4,80,00,000/- (Rupees Four Crores Eighty Lakhs Only) and is positive.

This certificate is issued at the specific request of the management for the purpose of bid qualification against GeM Tender Ref: GEM/2026/B/9821430.
Date: 15-Jan-2026 | UDIN: 25088219AKLM9912 | ICAI Reg: 014289N`
  },
  {
    id: 'doc-b-03',
    projectId: 'proj-gem-demo',
    fileName: 'Past_Performance_Certificates.pdf',
    category: 'bidder',
    type: 'PDF',
    size: '5.6 MB',
    uploadDate: '2026-03-02',
    status: 'Analyzed',
    pageCount: 18,
    relevantRequirementsCount: 4,
    textContent: `COMPILATION OF CONTRACT COMPLETION ENDORSEMENTS & PAST PERFORMANCE DOSSIER
Submitted by: ABC Industrial Solutions Pvt. Ltd. • GeM Vendor ID: VEND-MH-2023-881

EXHIBIT 1: BHARAT PETROLEUM CORPORATION LIMITED (BPCL)
Client Organization: BPCL Kochi Refinery Procurement Directorate
Purchase Order Reference: BPCL/KR/MECH/450098231 • Dated: 12-Apr-2023
Scope of Supply: Supply of High-Altitude Safety Webbing and Specialized Harness Units
Certified Value Executed: ₹1,10,40,000/- (Rupees One Crore Ten Lakhs Forty Thousand Only)
Completion & Commissioning Certificate: Issued 14-Jan-2024
Performance Remark: "Supplies executed satisfactorily within contractual timeline. Equipment quality meets petroleum safety standards."

EXHIBIT 2: TATA PROJECTS LIMITED (POWER TRANSMISSION DIVISION)
Client Organization: Tata Projects Ltd, Infrastructure & Energy Division
Contract Order Reference: TPL/TRANSMISSION/88102 • Dated: 18-Oct-2023
Scope of Work: Supply of Fall Protection Rigging Sets and Industrial Lanyards with annual maintenance
Certified Value Executed: ₹2,42,00,000/- (Rupees Two Crores Forty-Two Lakhs Only)
Completion Date: 22-Nov-2024
Performance Remark: "Vendor completed full consignments in conformity with technical specifications."

STATUTORY OPERATIONAL PEDIGREE SUMMARY:
Date of Corporate Incorporation: 12th February 2023 (Certificate of Incorporation No: U28999MH2023PTC398120).
Total Cumulative Operational Commercial Experience as on Bid Due Date: 2 Years 10 Months (2.8 Continuous Years).`
  },
  {
    id: 'doc-b-04',
    projectId: 'proj-gem-demo',
    fileName: 'GST_Registration_Certificate_27AAACB.pdf',
    category: 'bidder',
    type: 'PDF',
    size: '890 KB',
    uploadDate: '2026-03-02',
    status: 'Analyzed',
    pageCount: 3,
    relevantRequirementsCount: 2,
    textContent: `GOVERNMENT OF INDIA • GOODS AND SERVICES TAX NETWORK (GSTN)
FORM GST REG-06 [See Rule 10(1)] • REGISTRATION CERTIFICATE

1. Goods and Services Tax Identification Number (GSTIN): 27AAACB9812M1Z5
2. Legal Name of Business: ABC INDUSTRIAL SOLUTIONS PRIVATE LIMITED
3. Trade Name: ABC INDUSTRIAL SAFETY
4. Constitution of Business: Private Limited Company
5. Address of Principal Place of Business: Plot No. 44-B, Chakan Industrial Area Phase II, Taluka Khed, District Pune, Maharashtra, 410501
6. Date of Liability: 01/03/2023
7. Period of Validity: From 08/03/2023 to Continuous
8. Type of Registration: Regular Taxpayer
9. Statutory Compliances: GSTR-3B filings up to January 2026 reconciled with zero default notices.
Jurisdictional Authority: Assistant Commissioner of State Tax, Division IV, Pune Central, Maharashtra.`
  },
  {
    id: 'doc-b-05',
    projectId: 'proj-gem-demo',
    fileName: 'ISO_9001_2015_Accredited_Cert.pdf',
    category: 'bidder',
    type: 'PDF',
    size: '1.4 MB',
    uploadDate: '2026-03-02',
    status: 'Analyzed',
    pageCount: 2,
    relevantRequirementsCount: 2,
    textContent: `CERTIFICATE OF REGISTRATION • QUALITY MANAGEMENT SYSTEM
Registration Certificate Number: QMS/IND/2023/9102-REV1
Accreditation Board: National Accreditation Board for Certification Bodies (NABCB) • IAF MLA Signatory

This is to certify that the Quality Management System of:
ABC INDUSTRIAL SOLUTIONS PRIVATE LIMITED
Works: Plot No. 44-B, Chakan Industrial Area, Phase II, Pune - 410501, Maharashtra, India

Has been formally audited and found to be in full conformity with the standard:
ISO 9001:2015 (Quality Management Systems)

SCOPE OF CERTIFICATION:
"Design, Engineering, Fabrication, Testing, and Distribution of Industrial Safety Harnesses, Fall Arrest Mechanical Equipment, Personal Protective Workwear, and Associated Occupational Safety Accessories."

Initial Certification Date: 15-August-2023
Current Cycle Issue Date: 14-August-2024
Surveillance Audit 1: Successfully Concluded 22-July-2025
Valid Until: 14-August-2027 (Subject to Continuous Periodic Surveillance Conformity)
Issuing Registrar: Premier Certification Services Ltd (NABCB Reg: QM-042)`
  },
  {
    id: 'doc-b-06',
    projectId: 'proj-gem-demo',
    fileName: 'NABL_Test_Report_SafetyEquipment.pdf',
    category: 'bidder',
    type: 'PDF',
    size: '8.1 MB',
    uploadDate: '2026-03-02',
    status: 'Analyzed',
    pageCount: 24,
    relevantRequirementsCount: 6,
    textContent: `NATIONAL ACCREDITATION BOARD FOR TESTING AND CALIBRATION LABORATORIES (NABL)
CERTIFIED TEST REPORT • REPORT NO: NABL/TR/2026/0491-MECH/ELEC
Laboratory: Apex Material Science & Electrical Test House (NABL Accr: TC-8419)
Sample Description: Industrial Smart Safety Helmet Model ProShield-26 with Telemetry Bay
Sample Inward Date: 18-January-2026 • Testing Concluded: 04-February-2026

TEST OBSERVATIONS & EMPIRICAL LABORATORY FINDINGS:
1. Mechanical Tensile & Webbing Anchorage Test (IS 3521:1999 / EN 361):
• Specified Minimum Requirement: 22.0 kN Breaking Strength
• Observed Empirical Result: 26.4 kN (Yield point: 920 MPa)
• Evaluation: CONFORMS (PASS)

2. Flame Spread & Thermal Hazard Evaluation (IS 15841 / EN ISO 11612):
• Observed After-Flame Time: 0.2 seconds (Permissible limit: < 2.0 seconds)
• Char Length: 18 mm (Permissible limit: < 100 mm)
• Evaluation: CONFORMS (PASS)

3. Degree of Ingress Protection Assessment (IEC 60529:2013):
• Tested Parameter: Dust Tight (IP6X) & Water Spray Resistance under High Pressure Jet Nozzle (IPX5)
• Observed Result: Zero ingress under IP65 Test Condition 14.2.5
• Explicit Limitation Note: "Sample was not submitted for or subjected to continuous water immersion testing under IPX8 criteria (1.5m submerged depth for 120 minutes)."
• Final Standard Inscription: Certified for IP65 Ingress Standards Only.`
  },
  {
    id: 'doc-b-07',
    projectId: 'proj-gem-demo',
    fileName: 'Make_In_India_Class1_Affidavit.pdf',
    category: 'bidder',
    type: 'PDF',
    size: '620 KB',
    uploadDate: '2026-03-02',
    status: 'Analyzed',
    pageCount: 2,
    relevantRequirementsCount: 2,
    textContent: `AFFIDAVIT OF STATUTORY LOCAL CONTENT PURSUANT TO PUBLIC PROCUREMENT
(PREFERENCE TO MAKE IN INDIA) ORDER 2017 [REVISED NOTIFICATION DATED 16.09.2020]
Executed on Non-Judicial Stamp Paper of ₹500 before Notary Public, Pune, Maharashtra

I, Shri Vikramaditya Sharma, Director and Authorized Signatory of M/s ABC Industrial Solutions Private Limited, do hereby solemnly affirm, state, and declare on oath as follows:

1. That I am the authorized representative of the Bidder Company pursuant to Board Resolution dated 10th January 2026 and am competent to execute this statutory declaration.
2. That in respect of GeM Bid Tender GEM/2026/B/9821430 for "Supply of Industrial Safety Equipment", the items offered by us possess local domestic value addition to the extent of 68.50% (Sixty-Eight Point Five Zero Percent).
3. That the primary manufacturing, component stitching, harness assembly, and mechanical integration is carried out exclusively at our facility situated at:
Plot No. 44-B, Chakan Industrial Area Phase II, Taluka Khed, Pune - 410501, Maharashtra.
4. That in accordance with the provisions of DPIIT Order No. P-45021/2/2017-PP (BE-II), our company qualifies as a "Class-I Local Supplier" and is entitled to statutory purchase preference.
5. That the calculation of local content complies with the formula prescribed under paragraph 5 of the DPIIT notification, excluding applicable customs duties and imported sub-assemblies.

Deponent: Vikramaditya Sharma (Authorized Signatory)
Solemnly affirmed before me: Adv. R. S. Deshmukh, Notary Public (Reg: MH/NOT/2018/412)`
  },
  {
    id: 'doc-b-08',
    projectId: 'proj-gem-demo',
    fileName: 'MSME_Udyam_Registration_MH33D.pdf',
    category: 'bidder',
    type: 'PDF',
    size: '750 KB',
    uploadDate: '2026-03-02',
    status: 'Analyzed',
    pageCount: 2,
    relevantRequirementsCount: 2,
    textContent: `MINISTRY OF MICRO, SMALL AND MEDIUM ENTERPRISES • GOVERNMENT OF INDIA
UDYAM REGISTRATION CERTIFICATE

UDYAM REGISTRATION NUMBER: UDYAM-MH-33-0098421
NAME OF ENTERPRISE: ABC INDUSTRIAL SOLUTIONS PRIVATE LIMITED
TYPE OF ENTERPRISE: MEDIUM MANUFACTURING ENTERPRISE
DATE OF INCORPORATION: 12/02/2023 • DATE OF COMMENCEMENT OF PRODUCTION: 01/04/2023
NATIONAL INDUSTRY CLASSIFICATION (NIC 2-DIGIT): 32 - Other manufacturing (Safety equipment & gear)

STATUTORY TENDER ENTITLEMENT:
Pursuant to Rule 170(i) of General Financial Rules (GFR), 2017 and GeM GTC Clause 4(xii), the holder of this active Udyam Certificate is unconditionally exempt from depositing Earnest Money Deposit (EMD) / Bid Security for relevant manufacturing categories.`
  },
  {
    id: 'doc-b-09',
    projectId: 'proj-gem-demo',
    fileName: 'Company_Profile_Factory_License.pdf',
    category: 'bidder',
    type: 'PDF',
    size: '3.1 MB',
    uploadDate: '2026-03-02',
    status: 'Analyzed',
    pageCount: 8,
    relevantRequirementsCount: 3,
    textContent: `DIRECTORATE OF INDUSTRIAL SAFETY AND HEALTH (DISH) • GOVERNMENT OF MAHARASHTRA
FORM 4 (See Rule 5) • LICENSE TO WORK A FACTORY

License Number: MH/FAC/PUN/2023/118-RENEWED
Registration Date: 12-May-2023 • Renewed Up To: 31-December-2028
Licensee: ABC Industrial Solutions Private Limited
Premises: Plot No. 44-B, Chakan Industrial Estate Phase II, Pune 410501
Sanctioned Electric Power Load: 450 HP (High Tension Industrial Supply)
Permitted Maximum Daily Workforce: 120 Workmen

INSTALLED MANUFACTURING CAPACITIES:
• Industrial Fall Protection Harnesses: 15,000 units per calendar month
• High-Impact Polymer Safety Helmets: 25,000 units per calendar month
• Flame Retardant Workwear: 10,000 sets per calendar month
Quality Control Testing Laboratory: Equipped with Universal Testing Machine (UTM-100kN) and Environmental Chamber.`
  },
  {
    id: 'doc-b-10',
    projectId: 'proj-gem-demo',
    fileName: 'Warranty_Undertaking_Letter.pdf',
    category: 'bidder',
    type: 'PDF',
    size: '950 KB',
    uploadDate: '2026-03-02',
    status: 'Analyzed',
    pageCount: 3,
    relevantRequirementsCount: 2,
    textContent: `ABC INDUSTRIAL SOLUTIONS PRIVATE LIMITED
Corporate Office: 44-B, Chakan Industrial Area Phase II, Pune 410501
CIN: U28999MH2023PTC398120 • Web: www.abcindustrialsafety.com

COMPREHENSIVE WARRANTY & SERVICE LEVEL UNDERTAKING
To: The Senior Manager (Procurement), NTPC Limited, New Delhi
Tender Reference: GEM/2026/B/9821430 (Supply of Industrial Safety Equipment)

Dear Sir / Madam,
We hereby execute this formal contractual undertaking in respect of our bid submitted for the captioned procurement:

1. WARRANTY PERIOD REPRESENTATION:
We confirm that all safety equipment, full body harnesses, protective workwear, and smart helmets supplied under this contract shall carry an unconditional warranty against all manufacturing defects, material failures, and workmanship flaws for a duration of 24 (Twenty-Four) Months from the date of final commissioning at buyer site.

2. SERVICE LEVEL AGREEMENT & ON-SITE SUPPORT:
In the event of any product failure or operational malfunction notified by NTPC project sites, our qualified field service engineers shall acknowledge within 4 hours and report on-site within 24 to 48 hours for immediate replacement or rectifying actions.

Signed and Sealed for and on behalf of M/s ABC Industrial Solutions Private Limited:
Vikramaditya Sharma, Managing Director (DIN: 09812401)`
  },
];

export const DEMO_REQUIREMENTS: Requirement[] = [
  {
    id: 'req-01',
    projectId: 'proj-gem-demo',
    category: 'Financial',
    title: 'Minimum Annual Turnover',
    requirement: 'Bidder must have an average annual turnover of at least ₹10.00 crore in the last 3 financial years (FY 2022-23, FY 2023-24, FY 2024-25).',
    mandatory: true,
    requiredValue: '₹10.00 Cr',
    unit: 'INR',
    evidenceRequired: 'Audited Financial Statements / P&L Balance Sheets signed by Chartered Accountant',
    sourceDocument: 'GeM_Tender_Notice_GEM2026B9821430.pdf',
    sourcePage: 7,
  },
  {
    id: 'req-02',
    projectId: 'proj-gem-demo',
    category: 'Experience',
    title: 'Years of Experience in Industrial Safety Equipment',
    requirement: 'Bidder must have at least 5 years of continuous commercial experience in manufacturing/supplying industrial safety equipment to Central/State PSUs or Government Bodies.',
    mandatory: true,
    requiredValue: '5 years',
    unit: 'Years',
    evidenceRequired: 'Past supply contracts / Work completion certificates / Incorporation certificate',
    sourceDocument: 'GeM_Tender_Notice_GEM2026B9821430.pdf',
    sourcePage: 12,
  },
  {
    id: 'req-03',
    projectId: 'proj-gem-demo',
    category: 'Certification',
    title: 'ISO 9001:2015 Quality Management',
    requirement: 'Bidder must hold a valid ISO 9001:2015 accredited Quality Management System certification covering the scope of industrial PPE manufacture.',
    mandatory: true,
    requiredValue: 'ISO 9001:2015 Valid',
    unit: 'Standard',
    evidenceRequired: 'Accredited ISO 9001:2015 Certificate with valid NABCB/IAF hologram',
    sourceDocument: 'GeM_Tender_Notice_GEM2026B9821430.pdf',
    sourcePage: 15,
  },
  {
    id: 'req-04',
    projectId: 'proj-gem-demo',
    category: 'Technical',
    title: 'Waterproof & Ingress Protection Rating IP68',
    requirement: 'Sensor-enabled smart safety helmets must possess IP68 waterproof ingress protection certification under IEC 60529 tested by an accredited laboratory.',
    mandatory: true,
    requiredValue: 'IP68',
    unit: 'Ingress Code',
    evidenceRequired: 'NABL accredited test laboratory test report for IEC 60529 IP68 compliance',
    sourceDocument: 'Technical_Specifications_Schedule_A.pdf',
    sourcePage: 9,
  },
  {
    id: 'req-05',
    projectId: 'proj-gem-demo',
    category: 'Experience',
    title: 'Large-Scale Single Project Execution (₹2.50 Cr)',
    requirement: 'Bidder must demonstrate execution of at least one single order for industrial PPE valued at not less than ₹2.50 crore in the preceding 3 years.',
    mandatory: false,
    requiredValue: '₹2.50 Cr',
    unit: 'INR',
    evidenceRequired: 'Single Purchase Order along with corresponding Satisfactory Execution Certificate',
    sourceDocument: 'GeM_Tender_Notice_GEM2026B9821430.pdf',
    sourcePage: 13,
  },
  {
    id: 'req-06',
    projectId: 'proj-gem-demo',
    category: 'Technical',
    title: 'Flame Retardant Protective Coverall Compliance',
    requirement: 'Coverall fabric must be certified compliant with IS 15841 / EN ISO 11612 (Protective clothing against heat and flame).',
    mandatory: true,
    requiredValue: 'IS 15841 / EN ISO 11612',
    unit: 'Standard',
    evidenceRequired: 'Textile Research Association / NABL certified flammability test report',
    sourceDocument: 'Technical_Specifications_Schedule_A.pdf',
    sourcePage: 14,
  },
  {
    id: 'req-07',
    projectId: 'proj-gem-demo',
    category: 'Legal/Regulatory',
    title: 'Make in India (MII) Preference Local Content > 50%',
    requirement: 'Bidder must qualify as Class-I Local Supplier having minimum 50% local domestic value addition in accordance with DPIIT Order P-45021/2/2017-PP (BE-II).',
    mandatory: true,
    requiredValue: '≥ 50% Local Content',
    unit: 'Percentage',
    evidenceRequired: 'Self-certification affidavit specifying location of manufacturing & local percentage',
    sourceDocument: 'GeM_Tender_Notice_GEM2026B9821430.pdf',
    sourcePage: 18,
  },
  {
    id: 'req-08',
    projectId: 'proj-gem-demo',
    category: 'Eligibility',
    title: 'Valid Active GSTIN in State of Execution',
    requirement: 'Bidder must possess a valid, active GST registration with regular tax compliance status.',
    mandatory: true,
    requiredValue: 'Active Regular GSTIN',
    unit: 'Status',
    evidenceRequired: 'GST Registration Certificate Form GST REG-06 & latest GSTR-3B filing acknowledgement',
    sourceDocument: 'GeM_Tender_Notice_GEM2026B9821430.pdf',
    sourcePage: 6,
  },
  {
    id: 'req-09',
    projectId: 'proj-gem-demo',
    category: 'Financial',
    title: 'Bid Security / EMD Exemption Verification',
    requirement: 'Bidder must submit EMD of ₹5,00,000 or a valid statutory exemption certificate (Udyam / NSIC / Startup India recognition).',
    mandatory: true,
    requiredValue: '₹5,00,000 or MSME Exemption',
    unit: 'INR / Exemption',
    evidenceRequired: 'Bank Guarantee / Demand Draft or valid MSME Udyam Registration Certificate',
    sourceDocument: 'GeM_Tender_Notice_GEM2026B9821430.pdf',
    sourcePage: 8,
  },
  {
    id: 'req-10',
    projectId: 'proj-gem-demo',
    category: 'Technical',
    title: 'High-Altitude Harness Tensile Breaking Strength > 850 MPa',
    requirement: 'Full body harness webbings and D-rings must exhibit minimum tensile breaking strength exceeding 850 MPa according to IS 3521 part 1.',
    mandatory: true,
    requiredValue: '≥ 850 MPa',
    unit: 'MPa',
    evidenceRequired: 'Government accredited NABL test report showing load destruction graphs',
    sourceDocument: 'Technical_Specifications_Schedule_A.pdf',
    sourcePage: 6,
  },
  {
    id: 'req-11',
    projectId: 'proj-gem-demo',
    category: 'Delivery',
    title: 'Maximum Delivery Schedule Within 45 Days',
    requirement: 'Complete delivery of the ordered lot must be completed at NTPC Dadri stores within 45 days from date of GeM Contract generation.',
    mandatory: true,
    requiredValue: '45 Days',
    unit: 'Days',
    evidenceRequired: 'Delivery acceptance undertaking signed on bidder official letterhead',
    sourceDocument: 'GeM_Tender_Notice_GEM2026B9821430.pdf',
    sourcePage: 21,
  },
  {
    id: 'req-12',
    projectId: 'proj-gem-demo',
    category: 'Other',
    title: 'On-Site Technical SLA & 4-Hour Response Time',
    requirement: 'Bidder must guarantee on-site technical support within 4 hours of notification for emergency safety gear replacements within a 50km radius.',
    mandatory: false,
    requiredValue: '4 Hours Response',
    unit: 'Hours',
    evidenceRequired: 'Service Level Agreement commitment signed by authorized representative',
    sourceDocument: 'GeM_Tender_Notice_GEM2026B9821430.pdf',
    sourcePage: 24,
  },
  {
    id: 'req-13',
    projectId: 'proj-gem-demo',
    category: 'Certification',
    title: 'ISO 45001:2018 Occupational Health & Safety',
    requirement: 'Bidder or OEM manufacturer must hold valid ISO 45001:2018 certification for occupational workplace safety management.',
    mandatory: true,
    requiredValue: 'ISO 45001:2018 Valid',
    unit: 'Standard',
    evidenceRequired: 'Accredited ISO 45001 Certificate copy',
    sourceDocument: 'GeM_Tender_Notice_GEM2026B9821430.pdf',
    sourcePage: 16,
  },
  {
    id: 'req-14',
    projectId: 'proj-gem-demo',
    category: 'Documentation',
    title: 'Manufacturer Authorization Form (MAF / Annexure IV)',
    requirement: 'Non-OEM bidders must submit OEM authorization in prescribed format (Annexure IV) with explicit commitment to honor warranty and spare parts.',
    mandatory: true,
    requiredValue: 'OEM MAF Form IV',
    unit: 'Form',
    evidenceRequired: 'Duly signed OEM Manufacturer Authorization Letter with official stamp',
    sourceDocument: 'GeM_Tender_Notice_GEM2026B9821430.pdf',
    sourcePage: 28,
  },
  {
    id: 'req-15',
    projectId: 'proj-gem-demo',
    category: 'Financial',
    title: 'Bank Solvency Certificate (₹3.00 Cr)',
    requirement: 'Solvency certificate of at least ₹3.00 crore issued by a Scheduled Commercial Bank, dated not earlier than 6 months prior to bid opening.',
    mandatory: true,
    requiredValue: '₹3.00 Cr Solvency',
    unit: 'INR',
    evidenceRequired: 'Original Bank Solvency Certificate on bank security letterhead',
    sourceDocument: 'GeM_Tender_Notice_GEM2026B9821430.pdf',
    sourcePage: 9,
  },
];

export const DEMO_COMPLIANCE_RESULTS: ComplianceResult[] = [
  {
    id: 'comp-01',
    requirementId: 'req-01',
    requirement: DEMO_REQUIREMENTS[0],
    status: 'NON_COMPLIANT',
    confidence: 98,
    requiredCondition: 'Minimum turnover ₹10.00 Cr',
    extractedValue: '₹7.20 Cr (Audited Balance Sheet)',
    reasoning: 'The submitted Audited Financial Statement Schedule 3 reports revenue from operations of ₹7.20 crore for FY 2024-25. Normal deterministic check confirms: 7.20 < 10.00, which is below the mandatory tender threshold.',
    evaluationType: 'rule_based',
    contradictionFlag: true,
    contradictionDetails: 'Discrepancy detected between CA Certificate (₹12.40 Cr) and Audited Balance Sheet (₹7.20 Cr).',
    evidence: [
      {
        documentName: 'Audited_Balance_Sheet_Schedule_3.pdf',
        documentType: 'bidder',
        page: 7,
        extractedValue: '₹7.20 Cr',
        excerpt: 'Statement of Profit and Loss for the year ended 31st March 2025: Revenue from operations: INR 7,20,45,000 (Seven Crores Twenty Lakhs Forty Five Thousand). Total income: INR 7,38,10,000.',
        highlightSnippet: 'Revenue from operations: INR 7,20,45,000',
        confidence: 99,
      },
      {
        documentName: 'CA_Networth_Turnover_Certificate.pdf',
        documentType: 'bidder',
        page: 2,
        extractedValue: '₹12.40 Cr',
        excerpt: 'Certified that ABC Industrial Solutions achieved an aggregate annual turnover of INR 12,40,00,000 for FY 2024-25 across safety operations and group trade entities.',
        highlightSnippet: 'aggregate annual turnover of INR 12,40,00,000',
        confidence: 97,
      }
    ]
  },
  {
    id: 'comp-02',
    requirementId: 'req-02',
    requirement: DEMO_REQUIREMENTS[1],
    status: 'NON_COMPLIANT',
    confidence: 96,
    requiredCondition: 'Minimum 5 continuous years experience',
    extractedValue: '2.8 years (Incorporated Feb 2023)',
    reasoning: 'Company incorporation documents confirm establishment date of 12-Feb-2023. Oldest documented PSU work order was executed in Jan 2024. Total operational track record is 2.8 years, falling short of the 5-year requirement (2.8 < 5).',
    evaluationType: 'rule_based',
    evidence: [
      {
        documentName: 'Company_Profile_Factory_License.pdf',
        documentType: 'bidder',
        page: 2,
        extractedValue: '12-Feb-2023',
        excerpt: 'Company Registration Details: Certificate of Incorporation issued by Registrar of Companies, Mumbai on 12th February 2023. Operational duration: 36 months.',
        highlightSnippet: 'issued by Registrar of Companies, Mumbai on 12th February 2023',
        confidence: 99,
      },
      {
        documentName: 'Past_Performance_Certificates.pdf',
        documentType: 'bidder',
        page: 14,
        extractedValue: '2.8 years',
        excerpt: 'Cumulative Performance Record: Earliest contract commencement date: 15-Jan-2024 with Bharat Petroleum Corporation Limited. Elapsed supply record: 2.8 continuous years.',
        highlightSnippet: 'Elapsed supply record: 2.8 continuous years',
        confidence: 95,
      }
    ]
  },
  {
    id: 'comp-03',
    requirementId: 'req-03',
    requirement: DEMO_REQUIREMENTS[2],
    status: 'COMPLIANT',
    confidence: 97,
    requiredCondition: 'Valid ISO 9001:2015 Certificate',
    extractedValue: 'ISO 9001:2015 Valid till 14-Aug-2027',
    reasoning: 'Submitted ISO certificate verified with active accreditation body (NABCB). Scope specifically covers "Manufacture and supply of personal protective equipment and industrial safety gear". Validity extends through 14-Aug-2027.',
    evaluationType: 'hybrid',
    evidence: [
      {
        documentName: 'ISO_9001_2015_Accredited_Cert.pdf',
        documentType: 'bidder',
        page: 1,
        extractedValue: 'ISO 9001:2015',
        excerpt: 'This is to certify that the Quality Management System of ABC Industrial Solutions Pvt. Ltd. complies with ISO 9001:2015 for Manufacture and Supply of Industrial Safety Equipment. Certificate No: QMS/IND/2023/9102. Valid till: 14-Aug-2027.',
        highlightSnippet: 'complies with ISO 9001:2015 for Manufacture and Supply of Industrial Safety Equipment. Valid till: 14-Aug-2027',
        confidence: 98,
      }
    ]
  },
  {
    id: 'comp-04',
    requirementId: 'req-04',
    requirement: DEMO_REQUIREMENTS[3],
    status: 'NON_COMPLIANT',
    confidence: 95,
    requiredCondition: 'Waterproof Ingress Protection IP68',
    extractedValue: 'IP65 (Water jet resistant only)',
    reasoning: 'NABL accredited test report certifies compliance up to IP65 water jet resistance only. The mandatory specification specifically requires IP68 continuous immersion test compliance. Test reports lack immersion chamber test results.',
    evaluationType: 'hybrid',
    evidence: [
      {
        documentName: 'NABL_Test_Report_SafetyEquipment.pdf',
        documentType: 'bidder',
        page: 19,
        extractedValue: 'IP65 Tested',
        excerpt: 'Ingress Protection Testing as per IEC 60529: Sample tested under Clause 14.2.5 (Water Jets - IPX5). Result: No water ingress observed. Final Classification: IP65. Note: Submersion test under IPX8 was not requested by applicant.',
        highlightSnippet: 'Final Classification: IP65. Note: Submersion test under IPX8 was not requested',
        confidence: 97,
      }
    ]
  },
  {
    id: 'comp-05',
    requirementId: 'req-05',
    requirement: DEMO_REQUIREMENTS[4],
    status: 'NEEDS_REVIEW',
    confidence: 74,
    requiredCondition: 'Single order value ≥ ₹2.50 Cr',
    extractedValue: 'Base PO ₹2.42 Cr + ₹18 L Addendum',
    reasoning: 'Submitted purchase order from Tata Projects demonstrates a base contract value of ₹2.42 Crore. An unverified addendum mentions an additional ₹18 Lakhs AMC, but the completion certificate reflects only the base scope of ₹2.42 Cr. Procurement committee must review whether AMC amendment qualifies towards single order threshold.',
    evaluationType: 'semantic_llm',
    evidence: [
      {
        documentName: 'Past_Performance_Certificates.pdf',
        documentType: 'bidder',
        page: 8,
        extractedValue: '₹2.42 Cr base PO',
        excerpt: 'Tata Projects Work Order No. 88102: Total supply value: INR 2,42,00,000 exclusive of GST. Annexure B reflects discretionary AMC allocation of INR 18,00,000 subject to annual extension.',
        highlightSnippet: 'Total supply value: INR 2,42,00,000 exclusive of GST',
        confidence: 82,
      }
    ]
  },
  {
    id: 'comp-06',
    requirementId: 'req-06',
    requirement: DEMO_REQUIREMENTS[5],
    status: 'NEEDS_REVIEW',
    confidence: 76,
    requiredCondition: 'IS 15841 / EN ISO 11612 Standard',
    extractedValue: 'EN ISO 11611 (Welding standard)',
    reasoning: 'The bidder submitted a test certificate conforming to EN ISO 11611 (Protective clothing for welding and allied processes). The tender calls for IS 15841 / EN ISO 11612 (Flame and heat protective clothing). While related, standard test parameters for convective heat differ.',
    evaluationType: 'semantic_llm',
    evidence: [
      {
        documentName: 'NABL_Test_Report_SafetyEquipment.pdf',
        documentType: 'bidder',
        page: 11,
        extractedValue: 'EN ISO 11611 Class 2',
        excerpt: 'Flammability & Spatter Assessment: Test specimens subjected to radiant heat and molten droplet test under EN ISO 11611:2015. Classification: Class 2 compliant.',
        highlightSnippet: 'under EN ISO 11611:2015. Classification: Class 2 compliant',
        confidence: 88,
      }
    ]
  },
  {
    id: 'comp-07',
    requirementId: 'req-07',
    requirement: DEMO_REQUIREMENTS[6],
    status: 'COMPLIANT',
    confidence: 99,
    requiredCondition: 'Class-1 Local Supplier (≥ 50% Local Content)',
    extractedValue: '68.5% Local Content (Class-1)',
    reasoning: 'The bidder provided a notarized self-affidavit specifying 68.5% domestic value addition with full address of local manufacturing plant at Chakan MIDC, Pune. Meets and exceeds the 50% threshold.',
    evaluationType: 'rule_based',
    evidence: [
      {
        documentName: 'Make_In_India_Class1_Affidavit.pdf',
        documentType: 'bidder',
        page: 1,
        extractedValue: '68.5% Local Content',
        excerpt: 'We hereby solemnly declare that the Local Content in our industrial safety gear offered against GeM Bid GEM/2026/B/9821430 is 68.50%. Manufacturing and testing facility located at Plot B-14, Chakan MIDC Phase II, Pune.',
        highlightSnippet: 'Local Content in our industrial safety gear... is 68.50%',
        confidence: 99,
      }
    ]
  },
  {
    id: 'comp-08',
    requirementId: 'req-08',
    requirement: DEMO_REQUIREMENTS[7],
    status: 'COMPLIANT',
    confidence: 99,
    requiredCondition: 'Active Regular GSTIN',
    extractedValue: 'Active GSTIN 27AAACB9812M1Z5',
    reasoning: 'Valid GSTIN registration certificate provided. GST status is Active, Regular, registered in Maharashtra state. No adverse default notes recorded.',
    evaluationType: 'rule_based',
    evidence: [
      {
        documentName: 'GST_Registration_Certificate_27AAACB.pdf',
        documentType: 'bidder',
        page: 1,
        extractedValue: '27AAACB9812M1Z5',
        excerpt: 'Government of India Form GST REG-06. GSTIN: 27AAACB9812M1Z5. Legal Name: ABC Industrial Solutions Pvt. Ltd. Date of liability: 15-Feb-2023. Status: Active Regular.',
        highlightSnippet: 'GSTIN: 27AAACB9812M1Z5. Status: Active Regular',
        confidence: 99,
      }
    ]
  },
  {
    id: 'comp-09',
    requirementId: 'req-09',
    requirement: DEMO_REQUIREMENTS[8],
    status: 'COMPLIANT',
    confidence: 98,
    requiredCondition: '₹5,00,000 EMD or MSME Exemption',
    extractedValue: 'MSME Udyam Exemption Verified',
    reasoning: 'Bidder uploaded valid Udyam Registration Certificate (UDYAM-MH-33-0098421) under Manufacturing of Safety Equipment. Under GeM GTC Clause 4(m), registered MSME units are eligible for complete bid security exemption.',
    evaluationType: 'rule_based',
    evidence: [
      {
        documentName: 'MSME_Udyam_Registration_MH33D.pdf',
        documentType: 'bidder',
        page: 1,
        extractedValue: 'UDYAM-MH-33-0098421',
        excerpt: 'Ministry of Micro, Small & Medium Enterprises. Udyam Registration Certificate: UDYAM-MH-33-0098421. Enterprise Name: ABC Industrial Solutions Pvt. Ltd. Major Activity: Manufacturing.',
        highlightSnippet: 'Udyam Registration Certificate: UDYAM-MH-33-0098421. Major Activity: Manufacturing',
        confidence: 98,
      }
    ]
  },
  {
    id: 'comp-10',
    requirementId: 'req-10',
    requirement: DEMO_REQUIREMENTS[9],
    status: 'COMPLIANT',
    confidence: 98,
    requiredCondition: 'Harness Tensile Strength ≥ 850 MPa',
    extractedValue: '920 MPa (NABL Tested)',
    reasoning: 'NABL laboratory test report demonstrates breaking tensile strength of 920 MPa for full-body harness webbing, comfortably surpassing the required 850 MPa (920 > 850).',
    evaluationType: 'rule_based',
    evidence: [
      {
        documentName: 'NABL_Test_Report_SafetyEquipment.pdf',
        documentType: 'bidder',
        page: 6,
        extractedValue: '920 MPa',
        excerpt: 'Mechanical Destruction Test: Full body harness lanyard sample tested on UTM machine. Ultimate tensile strength recorded: 920 MPa. Minimum specified requirement: 850 MPa. Status: Satisfactory.',
        highlightSnippet: 'Ultimate tensile strength recorded: 920 MPa. Minimum specified requirement: 850 MPa',
        confidence: 99,
      }
    ]
  },
  {
    id: 'comp-11',
    requirementId: 'req-11',
    requirement: DEMO_REQUIREMENTS[10],
    status: 'COMPLIANT',
    confidence: 96,
    requiredCondition: 'Delivery schedule ≤ 45 Days',
    extractedValue: '35 Days Promised with Inventory Buffer',
    reasoning: 'Bidder submitted an unconditional delivery schedule undertaking agreeing to dispatch supplies within 35 calendar days from contract date, well within the 45-day ceiling.',
    evaluationType: 'rule_based',
    evidence: [
      {
        documentName: 'Warranty_Undertaking_Letter.pdf',
        documentType: 'bidder',
        page: 2,
        extractedValue: '35 Days',
        excerpt: 'Delivery Undertaking: We unconditionally agree to deliver the entire consignment to NTPC Dadri stores within 35 days of contract issuance, maintaining 10 days safety buffer against the tender limit of 45 days.',
        highlightSnippet: 'deliver the entire consignment to NTPC Dadri stores within 35 days',
        confidence: 97,
      }
    ]
  },
  {
    id: 'comp-12',
    requirementId: 'req-12',
    requirement: DEMO_REQUIREMENTS[11],
    status: 'NEEDS_REVIEW',
    confidence: 72,
    requiredCondition: '4-Hour Emergency Response SLA',
    extractedValue: '24-48 Hours Support Promised',
    reasoning: 'The tender requires on-site technical support within 4 hours for safety gear emergencies. The bidder’s warranty undertaking guarantees support only within 24 to 48 hours. Procurement authority must verify if this relaxed SLA is acceptable.',
    evaluationType: 'semantic_llm',
    evidence: [
      {
        documentName: 'Warranty_Undertaking_Letter.pdf',
        documentType: 'bidder',
        page: 3,
        extractedValue: '24-48 Hours',
        excerpt: 'Field engineer response time: We provide prompt technical support through our service engineer network within 24 to 48 hours of notification from buyer site during business days.',
        highlightSnippet: 'technical support through our service engineer network within 24 to 48 hours',
        confidence: 94,
      }
    ]
  },
  {
    id: 'comp-13',
    requirementId: 'req-13',
    requirement: DEMO_REQUIREMENTS[12],
    status: 'NEEDS_REVIEW',
    confidence: 68,
    requiredCondition: 'ISO 45001:2018 Certificate',
    extractedValue: 'Document Missing from Submission',
    reasoning: 'The tender specifies ISO 45001:2018 (Occupational Health and Safety) as a mandatory certification under Section 4.2. No certificate or audit receipt for ISO 45001 was uploaded in the bidder dossier.',
    evaluationType: 'rule_based',
    evidence: []
  },
  {
    id: 'comp-14',
    requirementId: 'req-14',
    requirement: DEMO_REQUIREMENTS[13],
    status: 'NEEDS_REVIEW',
    confidence: 70,
    requiredCondition: 'OEM Authorization Form IV',
    extractedValue: 'Document Missing from Submission',
    reasoning: 'Bidder is participating as a supplier/fabricator with third-party helmet electronics. Form IV (OEM Authorization Certificate) was not attached with the technical bid documents.',
    evaluationType: 'rule_based',
    evidence: []
  },
  {
    id: 'comp-15',
    requirementId: 'req-15',
    requirement: DEMO_REQUIREMENTS[14],
    status: 'NEEDS_REVIEW',
    confidence: 65,
    requiredCondition: 'Bank Solvency Certificate ₹3.00 Cr',
    extractedValue: 'Document Missing from Submission',
    reasoning: 'Tender clause 3.4 mandates a Bank Solvency Certificate of ₹3.00 Crore from a scheduled commercial bank. The bidder uploaded a CA Net Worth certificate instead of a direct bank solvency declaration.',
    evaluationType: 'rule_based',
    evidence: []
  },
];

export const DEMO_CONTRADICTIONS: Contradiction[] = [
  {
    id: 'contra-01',
    field: 'Annual Turnover FY 2024-25',
    severity: 'HIGH',
    description: 'Direct numeric conflict between Chartered Accountant turnover certificate and official audited balance sheet schedule.',
    sourceA: {
      document: 'CA_Networth_Turnover_Certificate.pdf',
      page: 2,
      value: '₹12.40 Crore',
      excerpt: 'Certified that ABC Industrial Solutions Pvt. Ltd. achieved an aggregate annual turnover of INR 12,40,00,000 for the financial year ended March 31, 2025.'
    },
    sourceB: {
      document: 'Audited_Balance_Sheet_Schedule_3.pdf',
      page: 7,
      value: '₹7.20 Crore',
      excerpt: 'Statement of Profit and Loss: Revenue from Operations for the year ended 31st March 2025: INR 7,20,45,000 (Seven Crores Twenty Lakhs Forty Five Thousand).'
    }
  },
  {
    id: 'contra-02',
    field: 'Monthly Manufacturing Capacity',
    severity: 'MEDIUM',
    description: 'Factory license claims capacity of 15,000 harnesses/month while company profile technical submission states maximum throughput of 8,500 units.',
    sourceA: {
      document: 'Company_Profile_Factory_License.pdf',
      page: 4,
      value: '15,000 units/month',
      excerpt: 'Plant capacity approved under Maharashtra Factories Act: 15,000 units of industrial fall-arrest harnesses per calendar month.'
    },
    sourceB: {
      document: 'Company_Profile_Factory_License.pdf',
      page: 7,
      value: '8,500 units/month',
      excerpt: 'Active installed tooling output: 8,500 units per month under single shift operation.'
    }
  }
];

export const DEMO_MISSING_DOCUMENTS: MissingDocument[] = [
  {
    id: 'miss-01',
    name: 'ISO 45001:2018 Certificate (Occupational Health & Safety)',
    category: 'Certification',
    mandatory: true,
    tenderClause: 'Clause 4.2 - Quality & Safety Accreditations',
    impactDescription: 'Mandatory GeM qualification parameter. Inability to verify workplace safety standards during manufacturing.'
  },
  {
    id: 'miss-02',
    name: 'Manufacturer Authorization Form (Annexure IV / OEM MAF)',
    category: 'Documentation',
    mandatory: true,
    tenderClause: 'Clause 7.1 - OEM Warranty and Service Commitment',
    impactDescription: 'Direct OEM backing and guaranteed supply of OEM components for 5 years cannot be ascertained.'
  },
  {
    id: 'miss-03',
    name: 'Scheduled Bank Solvency Certificate (₹3.00 Crore)',
    category: 'Financial',
    mandatory: true,
    tenderClause: 'Clause 3.4 - Financial Solvency Requirements',
    impactDescription: 'Proof of liquidity and bank line of credit missing. Only CA Net Worth provided, which does not substitute bank solvency.'
  }
];

export const DEMO_REPORT: ComplianceReport = {
  project: DEMO_PROJECT,
  generatedAt: '2026-03-08T07:15:00Z',
  overallScore: 78,
  executiveSummary: `BidSure AI has conducted an integrated compliance verification of the bid submitted by ABC Industrial Solutions Pvt. Ltd. against GeM Tender GEM/2026/B/9821430 (NTPC Limited - Supply of Industrial Safety Equipment). 

The bidder demonstrated compliance across 18 conditions including Quality Management (ISO 9001:2015), Make in India Class-1 local content (68.5%), GST regularity, and mechanical strength testing. 

However, the bid presents 3 critical NON-COMPLIANT determinations:
1. Annual turnover requirement of ₹10.00 Cr is not satisfied (Audited revenue is ₹7.20 Cr).
2. Minimum past PSU experience of 5 years is not satisfied (Entity incorporated in 2023; operational track record is 2.8 years).
3. Water ingress test report provides IP65 water jet resistance rather than the mandatory IP68 immersion rating.

Furthermore, a HIGH-SEVERITY CONTRADICTION was flagged between the CA Certificate (₹12.40 Cr) and Audited Balance Sheet (₹7.20 Cr), and 3 mandatory documents are missing (ISO 45001, OEM MAF, and Bank Solvency Certificate). Recommendation: The procurement evaluation committee should reject the financial & technical qualification or issue a GeM clarification notice for the discrepancies.`,
  matrix: DEMO_COMPLIANCE_RESULTS,
  nonCompliantItems: DEMO_COMPLIANCE_RESULTS.filter(c => c.status === 'NON_COMPLIANT'),
  reviewItems: DEMO_COMPLIANCE_RESULTS.filter(c => c.status === 'NEEDS_REVIEW'),
  missingDocuments: DEMO_MISSING_DOCUMENTS,
  contradictions: DEMO_CONTRADICTIONS,
  categoryBreakdown: [
    { category: 'Eligibility', score: 100, total: 1, compliant: 1, needsReview: 0, nonCompliant: 0 },
    { category: 'Financial', score: 60, total: 3, compliant: 1, needsReview: 1, nonCompliant: 1 },
    { category: 'Experience', score: 50, total: 2, compliant: 0, needsReview: 1, nonCompliant: 1 },
    { category: 'Technical', score: 88, total: 3, compliant: 1, needsReview: 1, nonCompliant: 1 },
    { category: 'Certification', score: 75, total: 2, compliant: 1, needsReview: 1, nonCompliant: 0 },
    { category: 'Documentation', score: 70, total: 1, compliant: 0, needsReview: 1, nonCompliant: 0 },
    { category: 'Delivery', score: 100, total: 1, compliant: 1, needsReview: 0, nonCompliant: 0 },
    { category: 'Legal/Regulatory', score: 100, total: 1, compliant: 1, needsReview: 0, nonCompliant: 0 },
    { category: 'Other', score: 85, total: 1, compliant: 0, needsReview: 1, nonCompliant: 0 },
  ],
  disclaimer: 'This Compliance Analysis Report is generated algorithmically by BidSure AI using a hybrid deterministic rule engine and Google Gemini LLM document semantic extraction. It is intended solely as an analytical decision-support tool for GeM procurement committees and does not constitute a legally binding procurement award or rejection decision.'
};
