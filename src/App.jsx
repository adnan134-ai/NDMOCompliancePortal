import { useState, useMemo, useCallback } from "react";

// Load Arabic font
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700;800&display=swap";
fontLink.rel = "stylesheet";
if (!document.querySelector('link[href*="Noto+Sans+Arabic"]')) document.head.appendChild(fontLink);
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip as RTooltip,
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";
import { Shield, ChevronRight, LogOut, AlertTriangle, CheckCircle, Clock, TrendingUp, Layers, Eye, ArrowLeft, BarChart3, Activity, Users, FileText, Building2, ChevronDown, Edit3, Save, X, MessageSquare, Upload, Send, Menu as MenuIcon } from "lucide-react";


// ═══ LANGUAGE & TRANSLATION SYSTEM ═══
const TRANSLATIONS = {
  // App-wide
  ndmoPortal: {en:"NDMO Portal", ar:"بوابة المكتب الوطني لإدارة البيانات"},
  ndmoCompliancePortal: {en:"NDMO Compliance Portal", ar:"بوابة الامتثال للمكتب الوطني لإدارة البيانات"},
  ndmoSubtitle: {en:"National Data Management Office — Control Assessment & Monitoring", ar:"المكتب الوطني لإدارة البيانات — تقييم ومراقبة الضوابط"},
  signIn: {en:"Sign In →", ar:"تسجيل الدخول ←"},
  signOut: {en:"Sign Out", ar:"تسجيل الخروج"},
  selectRole: {en:"Select your role to continue", ar:"اختر دورك للمتابعة"},
  dmoAdmin: {en:"DMO Admin", ar:"مدير مكتب إدارة البيانات"},
  dmoAdminDesc: {en:"Data Management Office — full access", ar:"مكتب إدارة البيانات — صلاحية كاملة"},
  dataSteward: {en:"Data Steward", ar:"أمين البيانات"},
  dataStewardDesc: {en:"Domain-level assessment view", ar:"عرض التقييم على مستوى المجال"},
  loggedInAs: {en:"Logged in as", ar:"تم تسجيل الدخول كـ"},
  dataManagementOfficeAdmin: {en:"Data Management Office Admin", ar:"مدير مكتب إدارة البيانات"},
  prototypeFooter: {en:"Prototype · 4 Business Units · 40 Sectors · 15 Domains · 85 Controls · 198 Specifications", ar:"نموذج أولي · 4 وحدات أعمال · 40 قطاع · 15 مجال · 85 ضابط · 198 مواصفة"},

  // Navigation
  neomOverview: {en:"Organization Overview", ar:"نظرة عامة على المنظمة"},
  back: {en:"Back", ar:"رجوع"},
  backToDashboard: {en:"Back to Dashboard", ar:"العودة إلى لوحة المعلومات"},
  switchSector: {en:"Switch Sector", ar:"تبديل القطاع"},
  selectYourSector: {en:"Select Your Sector", ar:"اختر قطاعك"},
  selectSectorDesc: {en:"Choose the Business Unit and Sector you are responsible for", ar:"اختر وحدة الأعمال والقطاع المسؤول عنه"},
  backToLogin: {en:"← Back to Login", ar:"→ العودة لتسجيل الدخول"},

  // NEOM Overview
  neomComplianceOverview: {en:"Organization Compliance Overview", ar:"نظرة عامة على امتثال المنظمة"},
  ndmoDataManagement: {en:"NDMO Data Management", ar:"إدارة البيانات - المكتب الوطني"},
  businessUnits: {en:"Business Units", ar:"وحدات الأعمال"},
  sectors: {en:"Sectors", ar:"القطاعات"},
  activeControls: {en:"Active Controls", ar:"الضوابط النشطة"},
  updatedJustNow: {en:"Updated just now", ar:"تم التحديث الآن"},

  // KPI Labels
  neomCompliance: {en:"Organization Compliance", ar:"امتثال المنظمة"},
  overallCompliance: {en:"Overall Compliance", ar:"الامتثال الشامل"},
  sectorCompliance: {en:"Sector Compliance", ar:"امتثال القطاع"},
  buCompliance: {en:"BU Compliance", ar:"امتثال الوحدة"},
  totalControls: {en:"Total Controls", ar:"إجمالي الضوابط"},
  totalSpecs: {en:"Specifications", ar:"المواصفات"},
  domainsAtRisk: {en:"Domains at Risk", ar:"المجالات المعرضة للخطر"},
  readyForReview: {en:"Ready for Review", ar:"جاهز للمراجعة"},
  review: {en:"Review", ar:"مراجعة"},
  open: {en:"Open", ar:"مفتوح"},
  closed: {en:"Closed", ar:"مغلق"},
  compliant: {en:"Compliant", ar:"ممتثل"},
  pending: {en:"Pending", ar:"معلق"},
  openActions: {en:"Open Actions", ar:"إجراءات مفتوحة"},
  assignedControls: {en:"Assigned Controls", ar:"الضوابط المسندة"},
  openControls: {en:"Open Controls", ar:"ضوابط مفتوحة"},
  inProgress: {en:"in progress", ar:"قيد التنفيذ"},
  awaitingAdmin: {en:"awaiting admin", ar:"بانتظار المدير"},
  completed: {en:"completed", ar:"مكتمل"},
  acrossAllSectors: {en:"across all sectors", ar:"عبر جميع القطاعات"},
  below50: {en:"below 50%", ar:"أقل من 50%"},
  requireAttention: {en:"require attention", ar:"تتطلب اهتمام"},
  inQueue: {en:"in queue", ar:"في قائمة الانتظار"},
  acrossMultipleDomains: {en:"across multiple domains", ar:"عبر مجالات متعددة"},
  across15Domains: {en:"across 15 domains", ar:"عبر 15 مجالاً"},

  // Section Headers
  portfolioOverview: {en:"Portfolio Overview", ar:"نظرة عامة على المحفظة"},
  domainCompliance: {en:"Domain Compliance", ar:"امتثال المجال"},
  domainComplianceAggregated: {en:"Domain Compliance (Aggregated)", ar:"امتثال المجال (مجمّع)"},
  domainComplianceRadar: {en:"Domain Compliance Radar", ar:"رادار امتثال المجالات"},
  clickToDrillDown: {en:"Click to drill down", ar:"انقر للتفصيل"},
  clickDomainToDrillDown: {en:"Click domain to drill down", ar:"انقر على المجال للتفصيل"},
  weakestDomains: {en:"Weakest Domains", ar:"أضعف المجالات"},
  allAbove55: {en:"All above 55%", ar:"جميعها أعلى من 55%"},
  trend: {en:"Trend", ar:"الاتجاه"},
  complianceTrend: {en:"Compliance Trend", ar:"اتجاه الامتثال"},
  allSectors: {en:"All Sectors", ar:"جميع القطاعات"},
  pendingActions: {en:"Pending Actions", ar:"إجراءات معلقة"},
  noPendingActions: {en:"No pending actions", ar:"لا توجد إجراءات معلقة"},
  fellowStewards: {en:"Fellow Stewards", ar:"أمناء البيانات الزملاء"},
  myAssignedControls: {en:"My Assigned Controls", ar:"الضوابط المسندة إليّ"},
  allAssignedControls: {en:"Assigned Controls", ar:"الضوابط المسندة"},

  // Table Headers
  control: {en:"Control", ar:"الضابط"},
  domain: {en:"Domain", ar:"المجال"},
  steward: {en:"Steward", ar:"أمين البيانات"},
  priority: {en:"Priority", ar:"الأولوية"},
  complianceStatus: {en:"Compliance Status", ar:"حالة الامتثال"},
  compliance: {en:"Compliance", ar:"الامتثال"},
  workflow: {en:"Workflow", ar:"سير العمل"},
  proposed: {en:"Proposed", ar:"المقترح"},
  comments: {en:"Comments", ar:"التعليقات"},
  evidence: {en:"Evidence", ar:"الأدلة"},
  assigned: {en:"Assigned", ar:"مسند"},
  sector: {en:"Sector", ar:"القطاع"},
  controls: {en:"Controls", ar:"الضوابط"},

  // BU Sector Table
  awaitingReview: {en:"awaiting review", ar:"بانتظار المراجعة"},
  totalControlsSub: {en:"total controls", ar:"إجمالي الضوابط"},
  avgAcross: {en:"avg across", ar:"المتوسط عبر"},

  // Control Detail
  controlDescription: {en:"Control Description", ar:"وصف الضابط"},
  auditLog: {en:"Audit Log", ar:"سجل المراجعة"},
  submitForReview: {en:"Submit for Admin Review", ar:"تقديم للمراجعة من المدير"},
  proposedStatus: {en:"Proposed status:", ar:"الحالة المقترحة:"},
  submitForReviewBtn: {en:"Submit for Review", ar:"تقديم للمراجعة"},
  reviewAndClose: {en:"Review & Close", ar:"مراجعة وإغلاق"},
  stewardProposed: {en:"Steward proposed:", ar:"اقتراح أمين البيانات:"},
  finalStatus: {en:"Final status:", ar:"الحالة النهائية:"},
  closeControl: {en:"Close Control", ar:"إغلاق الضابط"},
  reopen: {en:"Reopen", ar:"إعادة فتح"},
  noCommentsYet: {en:"No comments yet.", ar:"لا توجد تعليقات بعد."},
  typeMessage: {en:"Type your message...", ar:"اكتب رسالتك..."},
  noEvidenceYet: {en:"No evidence uploaded yet.", ar:"لم يتم رفع أي دليل بعد."},
  uploadEvidence: {en:"+ Upload Evidence File", ar:"+ رفع ملف دليل"},
  uploaded: {en:"Uploaded", ar:"تم الرفع"},

  // Domain Detail
  complianceByPriority: {en:"Compliance by Priority", ar:"الامتثال حسب الأولوية"},
  specifications: {en:"specifications", ar:"مواصفات"},
  p1ControlKPIs: {en:"P1 Control KPIs", ar:"مؤشرات أداء ضوابط الأولوية الأولى"},
  specificationDetails: {en:"Specification Details", ar:"تفاصيل المواصفات"},
  specNameAndDesc: {en:"Specification Name & Description", ar:"اسم ووصف المواصفة"},
  status: {en:"Status", ar:"الحالة"},
  assignedControlsReview: {en:"Assigned Controls — Review Status", ar:"الضوابط المسندة — حالة المراجعة"},

  // Statuses
  partiallyCompliant: {en:"Partially Compliant", ar:"ممتثل جزئياً"},
  nonCompliant: {en:"Non-Compliant", ar:"غير ممتثل"},
  notApplicable: {en:"Not Applicable", ar:"غير قابل للتطبيق"},

  // Workflow
  workflowOpen: {en:"Open", ar:"مفتوح"},
  workflowReady: {en:"Ready for Review", ar:"جاهز للمراجعة"},
  workflowClosed: {en:"Closed", ar:"مغلق"},

  // Welcome
  welcome: {en:"Welcome,", ar:"مرحباً،"},
  businessDataSteward: {en:"Business Data Steward", ar:"أمين بيانات الأعمال"},
  controlsAssigned: {en:"controls assigned", ar:"ضابط مسند"},
  readOnlyView: {en:"Read-only", ar:"للعرض فقط"},

  // Navigation Sections
  menu: {en:"Menu", ar:"القائمة"},
  userGuide: {en:"User Guide", ar:"دليل المستخدم"},
  aboutPortal: {en:"About Portal", ar:"حول البوابة"},
  aiEvidenceValidation: {en:"AI Evidence Validation", ar:"التحقق الذكي من الأدلة"},
  aiComplianceAdvisor: {en:"AI Compliance Advisor", ar:"مستشار الامتثال الذكي"},
  aiRiskScoring: {en:"AI Risk Scoring", ar:"تقييم المخاطر الذكي"},
  reportsAnalytics: {en:"Reports & Analytics", ar:"التقارير والتحليلات"},
  restricted: {en:"Restricted", ar:"مقيد"},
  comingSoon: {en:"Coming Soon", ar:"قريباً"},
  restrictedAccess: {en:"Restricted Access", ar:"وصول مقيد"},
  comingSoonLabel: {en:"Coming Soon", ar:"قريباً"},
  backToDashboardNav: {en:"Back to Dashboard", ar:"العودة إلى لوحة المعلومات"},
  
  // AI Evidence Validation
  aiEvTitle: {en:"AI Evidence Validation", ar:"التحقق الذكي من الأدلة"},
  aiEvDesc: {en:"Automatically validates submitted evidence documents against NDMO control requirements using AI-powered document analysis.", ar:"يتحقق تلقائياً من وثائق الأدلة المقدمة مقابل متطلبات ضوابط المكتب الوطني لإدارة البيانات باستخدام تحليل المستندات المدعوم بالذكاء الاصطناعي."},
  aiEvWhat: {en:"AI reads uploaded evidence (PDFs, policies, reports) and cross-references them against NDMO specification requirements. It identifies gaps, missing elements, and provides a completeness score with specific recommendations for remediation.", ar:"يقرأ الذكاء الاصطناعي الأدلة المرفوعة (ملفات PDF والسياسات والتقارير) ويقارنها بمتطلبات مواصفات المكتب الوطني. يحدد الثغرات والعناصر المفقودة ويوفر درجة اكتمال مع توصيات محددة للمعالجة."},
  aiEvWhy: {en:"Eliminates subjective manual evidence review. Ensures consistent assessment quality across all sectors. Reduces evidence review time from hours to minutes per control, and catches gaps before NDMO annual audits.", ar:"يلغي المراجعة اليدوية الذاتية للأدلة. يضمن جودة تقييم متسقة عبر جميع القطاعات. يقلل وقت مراجعة الأدلة من ساعات إلى دقائق لكل ضابط، ويكتشف الثغرات قبل عمليات التدقيق السنوية."},
  
  // AI Compliance Advisor
  aiCaTitle: {en:"AI Compliance Advisor", ar:"مستشار الامتثال الذكي"},
  aiCaDesc: {en:"AI-powered recommendations engine that suggests specific remediation actions to move controls from Non-Compliant to Compliant status.", ar:"محرك توصيات مدعوم بالذكاء الاصطناعي يقترح إجراءات معالجة محددة لنقل الضوابط من حالة غير ممتثل إلى ممتثل."},
  aiCaWhat: {en:"For each non-compliant control, the AI analyzes the gap between current state and NDMO requirements, then generates a prioritized action plan with specific deliverables, templates, and timelines tailored to the organization's context.", ar:"لكل ضابط غير ممتثل، يحلل الذكاء الاصطناعي الفجوة بين الوضع الحالي ومتطلبات المكتب الوطني، ثم يولد خطة عمل مرتبة حسب الأولوية مع مخرجات محددة وقوالب وجداول زمنية مخصصة لسياق المنظمة."},
  aiCaWhy: {en:"Data stewards often know their control is non-compliant but struggle with what to do next. This module bridges the knowledge gap, accelerating remediation and reducing dependency on expensive external consultants.", ar:"غالباً ما يعرف أمناء البيانات أن ضوابطهم غير ممتثلة لكنهم يواجهون صعوبة في تحديد الخطوة التالية. تسد هذه الوحدة فجوة المعرفة وتسرع المعالجة وتقلل الاعتماد على الاستشاريين الخارجيين المكلفين."},
  
  // AI Risk Scoring
  aiRsTitle: {en:"AI Risk Scoring", ar:"تقييم المخاطر الذكي"},
  aiRsDesc: {en:"Predictive risk engine that forecasts which controls are most likely to fail the next NDMO compliance assessment.", ar:"محرك تنبؤ بالمخاطر يتوقع الضوابط الأكثر عرضة لعدم اجتياز تقييم الامتثال القادم."},
  aiRsWhat: {en:"Analyzes evidence completeness, submission timelines, historical patterns, steward responsiveness, and domain complexity to generate a risk score (0-100) for each control. Surfaces the top 10 highest-risk controls organization-wide for executive attention.", ar:"يحلل اكتمال الأدلة والجداول الزمنية للتقديم والأنماط التاريخية واستجابة أمناء البيانات وتعقيد المجال لتوليد درجة مخاطر (0-100) لكل ضابط. يعرض أعلى 10 ضوابط خطورة على مستوى المنظمة لاهتمام الإدارة العليا."},
  aiRsWhy: {en:"Shifts compliance management from reactive to proactive. Instead of discovering failures during NDMO audits, leadership can intervene early on high-risk controls, allocating resources where they matter most.", ar:"ينقل إدارة الامتثال من ردة الفعل إلى الاستباقية. بدلاً من اكتشاف الإخفاقات أثناء عمليات التدقيق، يمكن للقيادة التدخل مبكراً في الضوابط عالية المخاطر وتخصيص الموارد حيث تكون أكثر أهمية."},
  
  // Reports & Analytics
  raTitle: {en:"Reports & Analytics", ar:"التقارير والتحليلات"},
  raDesc: {en:"Comprehensive compliance reporting suite with exportable dashboards, gap analysis, and NDMO submission-ready reports.", ar:"مجموعة شاملة من تقارير الامتثال مع لوحات معلومات قابلة للتصدير وتحليل الفجوات وتقارير جاهزة لتقديمها للمكتب الوطني."},
  raWhat: {en:"Generate compliance summary reports per sector (PDF), export full controls registers (Excel), produce gap analysis reports with remediation timelines, and create trend analytics across assessment cycles. All reports available in Arabic and English.", ar:"إنشاء تقارير ملخص الامتثال لكل قطاع (PDF)، وتصدير سجلات الضوابط الكاملة (Excel)، وإنتاج تقارير تحليل الفجوات مع جداول المعالجة، وإنشاء تحليلات الاتجاهات عبر دورات التقييم. جميع التقارير متاحة بالعربية والإنجليزية."},
  raWhy: {en:"Eliminates manual report assembly for NDMO submissions. Provides executive-ready compliance snapshots on demand. Tracks improvement trends across assessment cycles to demonstrate continuous progress to regulators.", ar:"يلغي تجميع التقارير يدوياً لتقديمات المكتب الوطني. يوفر لقطات امتثال جاهزة للإدارة العليا عند الطلب. يتتبع اتجاهات التحسين عبر دورات التقييم لإثبات التقدم المستمر للجهات الرقابية."},
  
  // About Portal
  aboutTitle: {en:"About the NDMO Compliance Portal", ar:"حول بوابة الامتثال للمكتب الوطني لإدارة البيانات"},
  aboutObjective: {en:"Objective", ar:"الهدف"},
  aboutObjectiveText: {en:"The NDMO Compliance Portal is a centralized platform designed to help Saudi government entities manage, track, and report compliance with the National Data Management Office (NDMO) Data Management and Personal Data Protection Standards across all 15 domains, 85 controls, and 198 specifications.", ar:"بوابة الامتثال للمكتب الوطني هي منصة مركزية مصممة لمساعدة الجهات الحكومية السعودية على إدارة وتتبع والإبلاغ عن الامتثال لمعايير إدارة البيانات وحماية البيانات الشخصية الصادرة عن المكتب الوطني لإدارة البيانات عبر جميع المجالات الـ 15 والضوابط الـ 85 والمواصفات الـ 198."},
  aboutValueTitle: {en:"Business Value", ar:"القيمة المؤسسية"},
  aboutValues: {en:"Avoid regulatory penalties up to SAR 5 million per violation|Reduce compliance management effort by up to 60% through automation|Ensure audit readiness with complete evidence trails and audit logs|Enable proactive compliance management across 40+ sectors|Support Saudi Vision 2030 data governance objectives|Identify revenue-generating data use cases through DVR domain tracking", ar:"تجنب العقوبات التنظيمية حتى 5 ملايين ريال لكل مخالفة|تقليل جهد إدارة الامتثال بنسبة تصل إلى 60% من خلال الأتمتة|ضمان الجاهزية للتدقيق بسجلات أدلة كاملة وسجلات مراجعة|تمكين إدارة الامتثال الاستباقية عبر أكثر من 40 قطاعاً|دعم أهداف حوكمة البيانات لرؤية السعودية 2030|تحديد حالات استخدام البيانات المولدة للإيرادات من خلال تتبع مجال تحقيق قيمة البيانات"},
  
  // User Guide
  ugTitle: {en:"User Guide", ar:"دليل المستخدم"},
  ugIntro: {en:"Welcome to the NDMO Compliance Portal User Guide. This guide explains the key concepts, workflows, and features available in the portal.", ar:"مرحباً بكم في دليل مستخدم بوابة الامتثال للمكتب الوطني لإدارة البيانات. يشرح هذا الدليل المفاهيم والعمليات والميزات الرئيسية المتاحة في البوابة."},
  ugComplianceStatuses: {en:"Compliance Statuses", ar:"حالات الامتثال"},
  ugWorkflowStatuses: {en:"Workflow Statuses", ar:"حالات سير العمل"},
  ugHowItWorks: {en:"How the Workflow Works", ar:"كيف يعمل سير العمل"},
  ugRoles: {en:"User Roles", ar:"أدوار المستخدمين"},
  ugNavigation: {en:"Navigation Levels", ar:"مستويات التنقل"},
  whatItDoes: {en:"What It Does", ar:"ما يقدمه"},
  whyItMatters: {en:"Why It Matters", ar:"لماذا هو مهم"},
  purpose: {en:"Purpose", ar:"الغرض"},
  accessContactAdmin: {en:"For access to this module, please contact the portal administrator.", ar:"للوصول إلى هذه الوحدة، يرجى الاتصال بمدير البوابة."},
  featureUnderDev: {en:"This feature is currently under development and will be available in a future release.", ar:"هذه الميزة قيد التطوير حالياً وستكون متاحة في إصدار مستقبلي."},

  // RAG
  good: {en:"GOOD", ar:"جيد"},
  attention: {en:"ATTENTION", ar:"انتباه"},
  atRisk: {en:"AT RISK", ar:"معرض للخطر"},

  // Misc
  businessUnit: {en:"Business Unit", ar:"وحدة الأعمال"},
};

function t(key, lang) { return TRANSLATIONS[key]?.[lang] || TRANSLATIONS[key]?.en || key; }

// Language Toggle Component
function LangToggle({lang, setLang}) {
  return (
    <button onClick={()=>setLang(lang==="en"?"ar":"en")}
      style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:8,
        border:"1px solid #e5e7eb",background:lang==="ar"?"#eef2ff":"#fff",cursor:"pointer",
        fontSize:12,fontWeight:600,color:lang==="ar"?"#6366f1":"#6b7280",transition:"all 0.15s"}}>
      {lang==="en"?"عربي":"EN"}
    </button>
  );
}


// ═══ NDMO SPEC DATA ═══
const NDMO_SPECS = [{"d":"DG","cid":"DG.1","cn":"Strategy and Plan","sid":"DG.1.1","sn":"Data Management and Personal Data Protection Strategy","sd":"The Entity shall establish a Data Management and Personal Data Protection Strategy to align Entity data initiatives and relevant stakeholders to achieving its business goals. The Strategy shall cover: 1. Current data management challenges 2. Strat...","p":"P1"},{"d":"DG","cid":"DG.1","cn":"Strategy and Plan","sid":"DG.1.2","sn":"Guiding Principles","sd":"The Entity shall adopt the National Data Management and Personal Data Protection Program's Guiding Principles. The Entity may include additional Entity-level guiding principles to augment the core set.","p":"P1"},{"d":"DG","cid":"DG.1","cn":"Strategy and Plan","sid":"DG.1.3","sn":"Data Management and Personal Data Protection Plan","sd":"The Entity shall develop a Data Management and Personal Data Protection Plan with a 3-year implementation roadmap including: 1. Initiatives covering all Data Management Domains 2. Prioritization of initiatives 3. Quick Wins planned within first 6 ...","p":"P1"},{"d":"DG","cid":"DG.1","cn":"Strategy and Plan","sid":"DG.1.4","sn":"Strategy Approval and Socialization","sd":"The Entity shall obtain formal approval by the Data Management Committee and socialize the Strategy in internal workshops.","p":"P1"},{"d":"DG","cid":"DG.2","cn":"Policy and Guidelines","sid":"DG.2.1","sn":"Policy and Guidelines Gap Analysis","sd":"The Entity shall conduct a gap analysis including: 1. Analysis of National DM and PDP Policies and Standards 2. Identification of existing data-related standards 3. Analysis of internal Entity requirements 4. A Policies development plan.","p":"P1"},{"d":"DG","cid":"DG.2","cn":"Policy and Guidelines","sid":"DG.2.2","sn":"Data Management and Personal Data Protection Policy and Guidelines","sd":"The Entity shall develop Entity-specific Policy and Guidelines aligned to the National Data Management and Personal Data Protection Policies and Standards.","p":"P1"},{"d":"DG","cid":"DG.3","cn":"Training and Awareness","sid":"DG.3.1","sn":"Data Management and Personal Data Protection Training","sd":"The Entity shall conduct training for all related employees covering: 1. Awareness of national DM and PDP laws, policies, and standards 2. Awareness of national DM and PDP programs 3. All data management domains.","p":"P1"},{"d":"DG","cid":"DG.4","cn":"Data Management Organization","sid":"DG.4.1","sn":"Data Management Office","sd":"The Entity shall establish a Data Management Office to manage achievement of national data management agendas at the Entity level, aligned with responsibilities in the NDMO Organizational Manual.","p":"P1"},{"d":"DG","cid":"DG.4","cn":"Data Management Organization","sid":"DG.4.2","sn":"Entity Data Management Committee","sd":"The Entity shall establish a Data Management Committee to provide direction and oversight to the overall data management agenda.","p":"P1"},{"d":"DG","cid":"DG.4","cn":"Data Management Organization","sid":"DG.4.3","sn":"Chief Data Officer","sd":"The Entity shall identify and appoint a Chief Data Officer with responsibilities aligned to the NDMO Organizational Manual.","p":"P1"},{"d":"DG","cid":"DG.4","cn":"Data Management Organization","sid":"DG.4.4","sn":"Data Governance Officer","sd":"The Entity shall identify and appoint a Data Governance Officer aligned to the NDMO Organizational Manual.","p":"P1"},{"d":"DG","cid":"DG.4","cn":"Data Management Organization","sid":"DG.4.5","sn":"Open Data and Information Access Officer","sd":"The Entity shall identify and appoint an Open Data and Information Access Officer (ODIA).","p":"P1"},{"d":"DG","cid":"DG.4","cn":"Data Management Organization","sid":"DG.4.6","sn":"Compliance Officer","sd":"The Entity shall identify and appoint a Compliance Officer to audit and monitor the data management agenda.","p":"P1"},{"d":"DG","cid":"DG.4","cn":"Data Management Organization","sid":"DG.4.7","sn":"Personal Data Protection Officer","sd":"The Entity shall identify and appoint a Personal Data Protection Officer (PDPO).","p":"P1"},{"d":"DG","cid":"DG.4","cn":"Data Management Organization","sid":"DG.4.8","sn":"Business Data Executive","sd":"The Entity shall identify and appoint Business Data Executives (BDE) for their related domains.","p":"P1"},{"d":"DG","cid":"DG.4","cn":"Data Management Organization","sid":"DG.4.9","sn":"Business Data Steward","sd":"The Entity shall identify and appoint Business Data Stewards to enable the data management agenda.","p":"P1"},{"d":"DG","cid":"DG.4","cn":"Data Management Organization","sid":"DG.4.10","sn":"IT Data Steward","sd":"The Entity shall identify and appoint IT Data Stewards to enable the data management agenda from an IT perspective.","p":"P1"},{"d":"DG","cid":"DG.4","cn":"Data Management Organization","sid":"DG.4.11","sn":"Legal Advisor","sd":"The Entity shall identify and appoint a Legal Advisor to support data-related regulatory matters.","p":"P1"},{"d":"DG","cid":"DG.5","cn":"Compliance Audit Framework","sid":"DG.5.1","sn":"Compliance Management","sd":"The Entity shall establish Compliance Management practices defining: 1. Scope of periodic compliance audit 2. Processes to plan and execute audits 3. Processes to report findings 4. Processes for remediation and escalation of non-compliance.","p":"P2"},{"d":"DG","cid":"DG.5","cn":"Compliance Audit Framework","sid":"DG.5.2","sn":"Compliance Audit Results","sd":"The Entity shall document results and findings in an Audit Report with: 1. Compliance/non-compliance to each specification 2. Findings with supporting evidence 3. Recommendations 4. Accountable stakeholders with target dates.","p":"P2"},{"d":"DG","cid":"DG.5","cn":"Compliance Audit Framework","sid":"DG.5.3","sn":"Compliance Monitoring","sd":"The Entity shall generate and monitor compliance audit scores by conducting periodic audits aligned to the national data management compliance framework.","p":"P2"},{"d":"DG","cid":"DG.6","cn":"Data Lifecycle Governance","sid":"DG.6.1","sn":"Periodic Plan Review","sd":"The Entity shall conduct periodic reviews to the Data Management Plan to ensure alignment towards stated program objectives and evolving priorities.","p":"P2"},{"d":"DG","cid":"DG.6","cn":"Data Lifecycle Governance","sid":"DG.6.2","sn":"Communications","sd":"The Entity shall implement a communications capability covering: 1. Key DM and PDP program updates 2. Storage of data management documents 3. Measure of performance metrics.","p":"P2"},{"d":"DG","cid":"DG.7","cn":"Performance Management","sid":"DG.7.1","sn":"Data Governance KPIs","sd":"The Entity shall establish KPIs including: 1. Assignment of DM and PDP roles 2. Periodic Committee Meetings 3. Strategy refresh 4. Trainings completed 5. Compliance Audit Score 6. Cycle time to resolve issues 7. Change requests resolved.","p":"P2"},{"d":"DG","cid":"DG.7","cn":"Performance Management","sid":"DG.7.2","sn":"Continuous Improvement","sd":"The Entity shall define, implement, and monitor continuous improvement mechanisms for all Data Management domains covering organization, processes, and technologies.","p":"P2"},{"d":"DG","cid":"DG.8","cn":"Artifacts","sid":"DG.8.1","sn":"Data Governance Approvals Register","sd":"The Entity shall document in a register CDO-approved data governance decisions with their justifications.","p":"P2"},{"d":"DG","cid":"DG.8","cn":"Artifacts","sid":"DG.8.2","sn":"Data Management Issue Tracking Register","sd":"The Entity shall document historical records of data management-related issues and resolutions.","p":"P3"},{"d":"DG","cid":"DG.8","cn":"Artifacts","sid":"DG.8.3","sn":"Version Control","sd":"The Entity shall define and implement version control for data management documents and artifacts.","p":"P2"},{"d":"MCM","cid":"MCM.1","cn":"Plan","sid":"MCM.1.1","sn":"Data Catalog Plan","sd":"The Entity shall create a Data Catalog Plan including: 1. Roadmap with activities and milestones for implementation of the Data Catalog automated tool 2. Assignment of required resources and budget.","p":"P1"},{"d":"MCM","cid":"MCM.1","cn":"Plan","sid":"MCM.1.2","sn":"Data Sources Prioritization","sd":"The Entity shall prioritize data sources to be included in the Data Catalog along with definition of their business and technical metadata.","p":"P1"},{"d":"MCM","cid":"MCM.1","cn":"Plan","sid":"MCM.1.3","sn":"Metadata Architecture","sd":"The Entity shall develop and document a target metadata architecture including: 1. Metadata sources 2. Metadata repository 3. Metadata flows 4. Metadata model.","p":"P1"},{"d":"MCM","cid":"MCM.2","cn":"Policy and Guidelines","sid":"MCM.2.1","sn":"Data Access Approval","sd":"The Entity shall establish a clear process for approval of connecting the Data Catalog tool to Entity's Data Sources.","p":"P2"},{"d":"MCM","cid":"MCM.2","cn":"Policy and Guidelines","sid":"MCM.2.2","sn":"Metadata Access Approval","sd":"The Entity shall establish a process for providing employees access to the Data Catalog with role-based access including creation of access groups and assignment of users.","p":"P2"},{"d":"MCM","cid":"MCM.3","cn":"Training and Awareness","sid":"MCM.3.1","sn":"Data Catalog Training","sd":"The Entity shall conduct training for employees covering: 1. Introduction to Data Catalog concept 2. Introductory and advanced tutorials 3. Hands-on exercises.","p":"P2"},{"d":"MCM","cid":"MCM.3","cn":"Training and Awareness","sid":"MCM.3.2","sn":"Data Catalog Adoption and Usage","sd":"The Entity shall push for adoption by: 1. Identification of Data Catalog power users 2. Creation of a communication plan encouraging interactions.","p":"P3"},{"d":"MCM","cid":"MCM.4","cn":"Data Lifecycle Management","sid":"MCM.4.1","sn":"Metadata Stewardship Coverage","sd":"The Entity shall assign Business and IT Data Stewards to all Metadata registered within the Data Catalog.","p":"P2"},{"d":"MCM","cid":"MCM.4","cn":"Data Lifecycle Management","sid":"MCM.4.2","sn":"Metadata Population","sd":"The Entity shall establish a clear process for registering and populating Metadata within the Data Catalog, implemented as a workflow in the automated tool.","p":"P2"},{"d":"MCM","cid":"MCM.4","cn":"Data Lifecycle Management","sid":"MCM.4.3","sn":"Metadata Structure","sd":"The Entity shall develop the Metadata structure according to NDMO's Data Catalog Guidelines, defining Business Metadata attributes required to be populated.","p":"P1"},{"d":"MCM","cid":"MCM.4","cn":"Data Lifecycle Management","sid":"MCM.4.4","sn":"Metadata Update","sd":"The Entity shall establish a clear process for updating Metadata within its Data Catalog.","p":"P2"},{"d":"MCM","cid":"MCM.4","cn":"Data Lifecycle Management","sid":"MCM.4.5","sn":"Metadata Quality","sd":"The Entity shall establish a process for identifying and addressing Metadata quality issues including reporting and remediation actions within defined SLAs.","p":"P1"},{"d":"MCM","cid":"MCM.4","cn":"Data Lifecycle Management","sid":"MCM.4.6","sn":"Metadata Annotation","sd":"The Entity shall establish a process for reviewing Metadata annotations (tags, comments) added by users to the Data Catalog.","p":"P3"},{"d":"MCM","cid":"MCM.4","cn":"Data Lifecycle Management","sid":"MCM.4.7","sn":"Metadata Certification","sd":"The Entity shall establish a process for reviewing trust certificates assigned by users to Metadata within the Data Catalog.","p":"P2"},{"d":"MCM","cid":"MCM.5","cn":"Data Catalog Automation","sid":"MCM.5.1","sn":"Data Catalog Automated Tool","sd":"The Entity shall implement the Data Catalog automated tool acting as an inventory of the Entity's data assets and supporting automation of Metadata management.","p":"P2"},{"d":"MCM","cid":"MCM.5","cn":"Data Catalog Automation","sid":"MCM.5.2","sn":"Metadata and Catalog Notifications","sd":"The Entity shall monitor changes to Metadata by setting up automated notifications within the Data Catalog automated tool.","p":"P2"},{"d":"MCM","cid":"MCM.5","cn":"Data Catalog Automation","sid":"MCM.5.3","sn":"Metadata and Catalog Audit Trail","sd":"The Entity shall monitor user activity within the Data Catalog by setting up a tracking functionality including logins and operations invoked.","p":"P2"},{"d":"MCM","cid":"MCM.5","cn":"Data Catalog Automation","sid":"MCM.5.4","sn":"Tool Versioning","sd":"The Entity shall have the Data Catalog automated tool updated to the latest published Vendor release or have an update plan reflected in the Data Catalog Development Plan.","p":"P2"},{"d":"MCM","cid":"MCM.6","cn":"Performance Management","sid":"MCM.6.1","sn":"Data Catalog KPIs","sd":"The Entity shall establish KPIs including: 1. Number of registered users 2. Active users 3. Logins 4. Metadata queries 5. Annotations added 6. Ratings added 7. Trust certificates assigned.","p":"P2"},{"d":"MCM","cid":"MCM.6","cn":"Performance Management","sid":"MCM.6.2","sn":"Metadata Quality KPIs","sd":"The Entity shall establish Metadata Quality KPIs including: 1. Completeness 2. Accuracy 3. Consistency.","p":"P2"},{"d":"DQ","cid":"DQ.1","cn":"Plan","sid":"DQ.1.1","sn":"Data Quality Prioritization","sd":"The Entity shall prioritize its data for Data Quality Management resulting in a ranked list. 1st priority data shall include, at minimum, the Entity's master data.","p":"P1"},{"d":"DQ","cid":"DQ.1","cn":"Plan","sid":"DQ.1.2","sn":"Data Quality Plan","sd":"The Entity shall create a Data Quality Plan including: 1. Roadmap with activities and key milestones 2. Assignment of required resources and budget.","p":"P1"},{"d":"DQ","cid":"DQ.1","cn":"Plan","sid":"DQ.1.3","sn":"Initial Data Quality Assessment","sd":"The Entity shall perform an Initial Data Quality Assessment including: 1. Collection of business requirements 2. Definition of Data Quality Rules 3. Data profiling 4. Reporting of identified issues 5. Development of remediation plans.","p":"P1"},{"d":"DQ","cid":"DQ.2","cn":"Data Quality Operations","sid":"DQ.2.1","sn":"Data Quality Rules Development","sd":"The Entity shall develop and document Data Quality Rules including: 1. Rule owner 2. Business description 3. Assignment to DQ dimensions 4. Data attributes validated 5. Metrics calculated 6. Escalation threshold.","p":"P2"},{"d":"DQ","cid":"DQ.2","cn":"Data Quality Operations","sid":"DQ.2.2","sn":"Data Quality Monitoring","sd":"The Entity shall monitor and document Data Quality on a regular basis by: 1. Executing existing Data Quality Rules 2. Reporting identified issues to data stewards and owners.","p":"P2"},{"d":"DQ","cid":"DQ.2","cn":"Data Quality Operations","sid":"DQ.2.3","sn":"Data Quality Issues Resolution","sd":"The Entity shall establish a process for resolving Data Quality issues including: 1. Remediation plan with root cause analysis 2. Decision and rationale on selected option 3. Implementation status 4. Review of implemented change.","p":"P2"},{"d":"DQ","cid":"DQ.2","cn":"Data Quality Operations","sid":"DQ.2.4","sn":"Data Quality Service Level Agreements","sd":"The Entity shall establish Data Quality SLAs specifying: 1. Timelines for developing remediation plans 2. Timelines for implementation and review 3. Escalation actions when SLA is not met.","p":"P2"},{"d":"DQ","cid":"DQ.2","cn":"Data Quality Operations","sid":"DQ.2.5","sn":"Data Quality Tools","sd":"The Entity shall implement tools supporting automation covering: 1. Data profiling 2. Data Quality rules management 3. Data Quality issues management.","p":"P2"},{"d":"DQ","cid":"DQ.3","cn":"Performance Management","sid":"DQ.3.1","sn":"Data Quality Trends","sd":"The Entity shall establish KPIs including: 1. Number of DQ issues reported based on Rules 2. Number of DQ issues reported by Data Catalog users 3. Number of DQ Rules deployed.","p":"P2"},{"d":"DQ","cid":"DQ.3","cn":"Performance Management","sid":"DQ.3.2","sn":"Data Quality Issues Resolution KPIs","sd":"The Entity shall establish KPIs including: 1. Resolved vs reported issues 2. Issues resolved after deadlines 3. Total time to develop remediation plan 4. Total time to resolve an issue.","p":"P2"},{"d":"DQ","cid":"DQ.4","cn":"Data Lifecycle Management","sid":"DQ.4.1","sn":"Data Quality Checkpoints","sd":"Business and IT Data Stewards shall conduct Data Quality reviews within the SDLC process. All issues shall be remediated before moving to production.","p":"P2"},{"d":"DQ","cid":"DQ.4","cn":"Data Lifecycle Management","sid":"DQ.4.2","sn":"Data Quality Support","sd":"The Entity shall establish a process enabling data users to report Data Quality issues to Business Data Stewards, implemented as a workflow in the Data Catalog.","p":"P3"},{"d":"DQ","cid":"DQ.4","cn":"Data Lifecycle Management","sid":"DQ.4.3","sn":"Data Quality Metadata","sd":"The Entity shall publish existing Data Quality Rules and monitoring results as metadata registered within the Data Catalog automated tool.","p":"P3"},{"d":"DO","cid":"DO.1","cn":"Plan","sid":"DO.1.1","sn":"Data Operations Plan","sd":"The Entity shall create a Data Operations Plan including: 1. Roadmap with activities and key milestones 2. Assignment of required resources and budget.","p":"P1"},{"d":"DO","cid":"DO.1","cn":"Plan","sid":"DO.1.2","sn":"Data Storage Forecasting","sd":"The Entity shall conduct periodic forecasts of storage capacity including: 1. Prediction of future storage needs 2. Estimation of budget for future storage acquisitions.","p":"P2"},{"d":"DO","cid":"DO.1","cn":"Plan","sid":"DO.1.3","sn":"Data Systems Prioritization","sd":"The Entity shall prioritize information systems based on business criticality resulting in a ranked list for the disaster recovery plan.","p":"P1"},{"d":"DO","cid":"DO.1","cn":"Plan","sid":"DO.1.4","sn":"Database Technology Evaluation","sd":"The Entity shall establish a process for DBMS evaluation covering: 1. Total cost of ownership 2. Availability of skilled resources 3. Related software tools 4. Volume and velocity limits 5. Reliability 6. Scalability 7. Security controls.","p":"P2"},{"d":"DO","cid":"DO.2","cn":"Policy and Guidelines","sid":"DO.2.1","sn":"Storage and Retention Policy","sd":"The Entity shall create a storage and retention policy covering: 1. Storage conditions ensuring protection in disasters 2. Retention periods based on type, classification and legal requirements 3. Disposal and destruction rules 4. Actions in case ...","p":"P1"},{"d":"DO","cid":"DO.3","cn":"Database Operations","sid":"DO.3.1","sn":"Database Monitoring","sd":"The Entity shall monitor and report database performance covering: 1. Capacity 2. Availability 3. Queries execution performance 4. Changes tracking.","p":"P2"},{"d":"DO","cid":"DO.3","cn":"Database Operations","sid":"DO.3.2","sn":"Database Access Control","sd":"The Entity shall establish a process for providing employees database access implementing role-based access with assignment of roles and permissions.","p":"P2"},{"d":"DO","cid":"DO.3","cn":"Database Operations","sid":"DO.3.3","sn":"Storage Configuration Management","sd":"The Entity shall establish a process for managing Storage Configuration including: 1. Configuration identification 2. Change control 3. Status accounting 4. Configuration audits.","p":"P2"},{"d":"DO","cid":"DO.3","cn":"Database Operations","sid":"DO.3.4","sn":"DBMS Versioning","sd":"The Entity shall have DBMS tools updated to the latest published Vendor release or have an update plan reflected in the Data Management Plan.","p":"P3"},{"d":"DO","cid":"DO.3","cn":"Database Operations","sid":"DO.3.5","sn":"Service Level Agreements","sd":"The Entity shall establish database performance SLAs covering: 1. Timeframes for database availability 2. Maximum allowable execution time 3. Escalation actions.","p":"P2"},{"d":"DO","cid":"DO.4","cn":"Business Continuity","sid":"DO.4.1","sn":"Data Backup Recovery","sd":"The Entity shall establish a process for data backup and recovery including: 1. Backup frequency definition 2. Scope of backup 3. Location of backup files 4. Periodic validations.","p":"P2"},{"d":"DO","cid":"DO.4","cn":"Business Continuity","sid":"DO.4.2","sn":"Disaster Recovery","sd":"The Entity shall establish a disaster recovery plan including: 1. Prioritized list of information systems 2. Assignment of incident response roles 3. Activation actions 4. Damage reduction actions 5. RPO 6. RTO 7. Recovery activities.","p":"P2"},{"d":"DO","cid":"DO.4","cn":"Business Continuity","sid":"DO.4.3","sn":"Production Data Access Control","sd":"The Entity shall establish a process for database changes to Production Environments including: 1. Change request 2. Controlled implementation actions 3. Rollback actions.","p":"P2"},{"d":"DO","cid":"DO.5","cn":"Performance Management","sid":"DO.5.1","sn":"Storage KPIs","sd":"The Entity shall establish KPIs including: 1. % total data storage capacity used 2. % capacity used by type 3. % capacity used for backups 4. Number of data transactions 5. Average query execution time.","p":"P2"},{"d":"DCM","cid":"DCM.1","cn":"Plan","sid":"DCM.1.1","sn":"Document and Content Management Plan","sd":"The Entity shall create a Document and Content Management Plan including: 1. Roadmap with activities and milestones 2. Assignment of required resources and budget.","p":"P1"},{"d":"DCM","cid":"DCM.1","cn":"Plan","sid":"DCM.1.2","sn":"Documents Digitization Plan","sd":"The Entity shall create a Documents Digitization Plan including: 1. Roadmap for migration of paper-based documents 2. Roadmap for eliminating paper-based documents 3. Assignment of resources and budget.","p":"P1"},{"d":"DCM","cid":"DCM.1","cn":"Plan","sid":"DCM.1.3","sn":"Documents Prioritization","sd":"The Entity shall identify and prioritize documents to be stored in the DMS resulting in a ranked list for implementation.","p":"P1"},{"d":"DCM","cid":"DCM.1","cn":"Plan","sid":"DCM.1.4","sn":"Documents Workflows Prioritization","sd":"The Entity shall identify and prioritize key processes to be implemented as workflows in DMS resulting in a ranked list for implementation.","p":"P1"},{"d":"DCM","cid":"DCM.2","cn":"Policy and Guidelines","sid":"DCM.2.1","sn":"Document and Content Management Policy","sd":"The Entity shall create a policy covering: 1. Naming conventions 2. Classification level assignment 3. Access approval 4. Backup and recovery 5. Retention and disposal.","p":"P1"},{"d":"DCM","cid":"DCM.3","cn":"Training and Awareness","sid":"DCM.3.1","sn":"Document and Content Management Training","sd":"The Entity shall conduct training including: 1. Introduction to policies around Document and Content Management 2. Introductory and advanced tutorials about DMS.","p":"P2"},{"d":"DCM","cid":"DCM.4","cn":"Document and Content Operations","sid":"DCM.4.1","sn":"Backup and Recovery","sd":"The Entity shall include the Document and Content Management Systems within its overall backup and recovery plan.","p":"P3"},{"d":"DCM","cid":"DCM.4","cn":"Document and Content Operations","sid":"DCM.4.2","sn":"Retention and Disposal","sd":"The Entity shall establish a process for retention and disposal including: 1. Handover to archival facility 2. Physical destruction including overwriting and secure deletion.","p":"P2"},{"d":"DCM","cid":"DCM.4","cn":"Document and Content Operations","sid":"DCM.4.3","sn":"Document and Content Access Approval","sd":"The Entity shall establish a process for providing employees access to documents and content implementing role-based access.","p":"P2"},{"d":"DCM","cid":"DCM.4","cn":"Document and Content Operations","sid":"DCM.4.4","sn":"Document and Content Metadata Publishing","sd":"The Entity shall publish metadata of documents and content stored within DMS in the Entity's Data Catalog automated tool.","p":"P3"},{"d":"DCM","cid":"DCM.4","cn":"Document and Content Operations","sid":"DCM.4.5","sn":"Documents and Content Management Tools","sd":"The Entity shall implement tools including: 1. Document Management System (DMS) with storage, OCR, indexing, versioning, access, search, and workflows 2. Web Content Management System 3. Collaboration tools.","p":"P3"},{"d":"DCM","cid":"DCM.5","cn":"Performance Management","sid":"DCM.5.1","sn":"Documents Management KPIs","sd":"The Entity shall establish KPIs including: 1. Volume of documents in DMS 2. Number of DMS users 3. % of paper-based documents migrated to electronic format.","p":"P2"},{"d":"DAM","cid":"DAM.1","cn":"Plan","sid":"DAM.1.1","sn":"Data Architecture and Modeling Plan","sd":"The Entity shall create a Data Architecture and Modeling Plan including: 1. Roadmap with activities and key milestones 2. Assignment of required resources and budget.","p":"P1"},{"d":"DAM","cid":"DAM.2","cn":"Policy and Guidelines","sid":"DAM.2.1","sn":"Data Architecture and Modeling Policy","sd":"The Entity shall document and publish a policy covering: 1. Target Architecture shall address strategic requirements 2. Developed in conjunction with Enterprise Architecture 3. Adopt a widely used EA Framework (e.g. TOGAF, Zachmann) 4. Data Models...","p":"P1"},{"d":"DAM","cid":"DAM.3","cn":"Data Architecture Framework Definition","sid":"DAM.3.1","sn":"Current State Architecture","sd":"The Entity shall define its baseline current state Data Architecture covering: 1. Data Model at Conceptual, Logical and Physical level 2. Key Processes 3. Key System Components 4. Data Flows and Lineage.","p":"P1"},{"d":"DAM","cid":"DAM.3","cn":"Data Architecture Framework Definition","sid":"DAM.3.2","sn":"Target State Architecture","sd":"The Entity shall define and develop a future state target data architecture covering: 1. Data Model at all levels 2. Key Processes 3. Key System Components 4. Data Flows and Lineage.","p":"P2"},{"d":"DAM","cid":"DAM.3","cn":"Data Architecture Framework Definition","sid":"DAM.3.3","sn":"Future State Gap Assessment","sd":"The Entity shall conduct and document a gap analysis between current and target state architecture to inform definition of required initiatives.","p":"P2"},{"d":"DAM","cid":"DAM.3","cn":"Data Architecture Framework Definition","sid":"DAM.3.4","sn":"Big Data Considerations","sd":"The Entity shall identify and document requirements for developing a Data Lake environment using a vendor-neutral Big Data Reference Architecture Framework.","p":"P2"},{"d":"DAM","cid":"DAM.3","cn":"Data Architecture Framework Definition","sid":"DAM.3.5","sn":"Data Processing Considerations","sd":"The Entity shall employ and document a partitioning strategy for efficient processing of various data volumes, variety and velocity covering both real-time and batch processing.","p":"P2"},{"d":"DAM","cid":"DAM.4","cn":"Data Modeling Definition","sid":"DAM.4.1","sn":"Model Representation","sd":"The Entity shall select and follow a diagramming method (e.g. UML) for documenting the structure, relationships and notations of business entities at conceptual, logical and physical levels.","p":"P2"},{"d":"DAM","cid":"DAM.4","cn":"Data Modeling Definition","sid":"DAM.4.2","sn":"Tools and Technologies","sd":"The Entity shall select and implement a toolset covering: 1. Data Architecture Design 2. Data Modeling 3. Data Lineage.","p":"P2"},{"d":"DSI","cid":"DSI.1","cn":"Plan","sid":"DSI.1.1","sn":"Initial Data Integration Assessment","sd":"The Entity shall perform an Initial Data Integration Assessment to identify pain points including: 1. Inventory of all existing IT components 2. High-level Data Lineage documentation 3. Documenting data models used by IT components. Result shall b...","p":"P1"},{"d":"DSI","cid":"DSI.1","cn":"Plan","sid":"DSI.1.2","sn":"Target Data Integration Architecture","sd":"The Entity shall create a Target Data Integration Architecture based on pain points identified, including: 1. Data Integration Requirements 2. Architecture Diagram 3. Architecture Components list.","p":"P1"},{"d":"DSI","cid":"DSI.1","cn":"Plan","sid":"DSI.1.3","sn":"Data Integration Plan","sd":"The Entity shall create a Data Integration Plan including: 1. Roadmap with activities and key milestones for implementation of the Target Data Integration Architecture 2. Assignment of required resources and budget.","p":"P1"},{"d":"DSI","cid":"DSI.2","cn":"Training and Awareness","sid":"DSI.2.1","sn":"Data Sharing Training","sd":"The Entity shall conduct Data Sharing training for every employee involved in Data Sharing initiatives covering: 1. Applicability of Data Sharing process 2. Leading practices of data handling 3. Consequences of mishandling 4. Data Sharing Principl...","p":"P2"},{"d":"DSI","cid":"DSI.3","cn":"Integration Solution Development Lifecycle","sid":"DSI.3.1","sn":"Integration Requirements Document","sd":"The Entity shall produce an Integration Requirements Document for each data integration initiative including: 1. Clearly defined scope 2. Business goals and objectives 3. Implementation Timeline 4. Resources required 5. Cost estimate 6. Functional...","p":"P1"},{"d":"DSI","cid":"DSI.3","cn":"Integration Solution Development Lifecycle","sid":"DSI.3.2","sn":"Solution Design Document","sd":"The Entity shall create a Solution Design Document including: 1. Integration Solution Overview 2. Target Architecture Adherence 3. Data Orchestration (DFD) 4. Source-To-Target Mapping with technical format and transformation specifications.","p":"P1"},{"d":"DSI","cid":"DSI.3","cn":"Integration Solution Development Lifecycle","sid":"DSI.3.3","sn":"Integration Solution Testing","sd":"The Entity shall perform testing prior to deployment including: 1. Integration Testing - verifying correctness of data flows 2. Functional Testing - verifying functional and non-functional requirements. Each stage shall include defining Test Use C...","p":"P2"},{"d":"DSI","cid":"DSI.3","cn":"Integration Solution Development Lifecycle","sid":"DSI.3.4","sn":"Monitoring and Maintenance","sd":"The Entity shall actively monitor and maintain Integration Solutions after release including: 1. Reporting identified bugs or defects 2. Producing Change Request documents to accommodate change requirements.","p":"P3"},{"d":"DSI","cid":"DSI.4","cn":"Data Processes","sid":"DSI.4.1","sn":"ETL Process","sd":"The Entity shall design, document and follow ETL (Extract Transform Load) process to integrate data from disparate sources and load it into a Data Warehouse Store, including: 1. Extract 2. Transform (Data Mapping, Transformation, Review) 3. Load s...","p":"P2"},{"d":"DSI","cid":"DSI.4","cn":"Data Processes","sid":"DSI.4.2","sn":"ELT Process","sd":"The Entity shall design, document and follow ELT (Extract Load Transform) process to store unstructured data in its raw native format in the Data Lake, including: 1. Extract 2. Loading 3. Transform steps.","p":"P2"},{"d":"DSI","cid":"DSI.5","cn":"Data Sharing Process","sid":"DSI.5.1","sn":"Data Sharing Process","sd":"The Entity shall adopt and follow the NDMO Data Sharing Process when sharing data externally, including steps: 1. Request Reception 2. Roles assignment 3. Classification check 4. Principles assessment 5. Decision and feedback 6. BDE approval 7. De...","p":"P1"},{"d":"DSI","cid":"DSI.6","cn":"Data Sharing Requests","sid":"DSI.6.1","sn":"Data Sharing Request Submission Channel","sd":"The Entity shall establish on its official Government website a channel to manage submission and reception of Data Sharing requests. Each request shall be routed to the Data Office.","p":"P1"},{"d":"DSI","cid":"DSI.7","cn":"Data Sharing Agreements","sid":"DSI.7.1","sn":"Internal Data Sharing Agreements","sd":"The Entity shall define and follow an Internal Data Sharing agreement template used when data is shared between information systems within the Entity.","p":"P2"},{"d":"DSI","cid":"DSI.7","cn":"Data Sharing Agreements","sid":"DSI.7.2","sn":"External Data Sharing Agreements","sd":"The Entity shall design and implement Data Sharing controls documented in the Data Sharing Agreement including: 1. Purpose of sharing 2. Information about requesting and sharing Entity 3. Lawful basis 4. Sharing details 5. Liability provisions. Ag...","p":"P1"},{"d":"DSI","cid":"DSI.7","cn":"Data Sharing Agreements","sid":"DSI.7.3","sn":"Data Sharing Agreements Review","sd":"The Entity shall review all ongoing Data Sharing agreements on a regular basis to accommodate any changes, documented by the Data Steward.","p":"P2"},{"d":"DSI","cid":"DSI.8","cn":"Performance Management","sid":"DSI.8.1","sn":"Data Sharing and Interoperability KPIs","sd":"The Entity shall establish KPIs including: 1. Data transfer rate 2. Latency between sources and targets 3. Number of sharing requests received 4. Requests accepted/denied 5. Requests sent 6. Ongoing agreements 7. Average duration of requests evalu...","p":"P2"},{"d":"RMD","cid":"RMD.1","cn":"Plan","sid":"RMD.1.1","sn":"Reference and Master Data Plan","sd":"The Entity shall create an RMD Plan including: 1. Roadmap with activities and key milestones for implementation 2. Assignment of required resources and budget.","p":"P1"},{"d":"RMD","cid":"RMD.1","cn":"Plan","sid":"RMD.1.2","sn":"Reference and Master Data Identification and Prioritization","sd":"The Entity shall identify its reference and master data covering: 1. Identification of Master Data objects 2. Identification of Reference Data Objects 3. Identification of data sources and applications where RMD objects are created, read, updated ...","p":"P1"},{"d":"RMD","cid":"RMD.1","cn":"Plan","sid":"RMD.1.3","sn":"Reference Data Categorization","sd":"The Entity shall categorize identified Reference Data Objects as either: Internal (owned and managed by Entity, Single Source of Truth) or External (owned by other Entities or from external organizations such as ISO).","p":"P1"},{"d":"RMD","cid":"RMD.1","cn":"Plan","sid":"RMD.1.4","sn":"Master Data Categorization","sd":"The Entity shall categorize identified Master Data objects as either: Internal (owned and managed by Entity) or External (owned and managed by other Entities across government).","p":"P1"},{"d":"RMD","cid":"RMD.2","cn":"Architecture","sid":"RMD.2.1","sn":"RMD Requirements","sd":"The Entity shall establish and document RMD requirements covering: 1. Processes and roles for managing RMD across lifecycle 2. Rules for matching and merging Master Data Records 3. Requirements for provisioning Golden Records 4. Requirements for p...","p":"P1"},{"d":"RMD","cid":"RMD.2","cn":"Architecture","sid":"RMD.2.2","sn":"RMD Data Hub Design","sd":"The Entity shall evaluate and select RMD Hub architecture design from: 1. Registry Hub 2. Repository Hub 3. Coexistence Hub 4. Centralized Hub. Reference Data shall be managed through Centralized Hub acting as single provider.","p":"P1"},{"d":"RMD","cid":"RMD.2","cn":"Architecture","sid":"RMD.2.3","sn":"RMD Conceptual Architecture","sd":"The Entity shall develop and document a conceptual architecture for its target RMD environment including: 1. Architecture Description 2. Components Definitions and Descriptions 3. Conceptual Architecture Diagram.","p":"P1"},{"d":"RMD","cid":"RMD.2","cn":"Architecture","sid":"RMD.2.4","sn":"RMD Information Architecture","sd":"The Entity shall develop and document an information architecture including: 1. RMD Objects inventory 2. Conceptual and Logical Master Data Model 3. Reference and Master Data Sources 4. Rules for matching and merging 5. Reference and Master Data F...","p":"P2"},{"d":"RMD","cid":"RMD.2","cn":"Architecture","sid":"RMD.2.5","sn":"RMD Data Hub Technical Requirements","sd":"The Entity shall define technical requirements for its RMD Hub platform covering: 1. Management of Workflows 2. Versioning Control 3. Functional Capabilities 4. Technical Capabilities 5. Security.","p":"P2"},{"d":"RMD","cid":"RMD.3","cn":"Training and Awareness","sid":"RMD.3.1","sn":"Reference and Master Data Training","sd":"The Entity shall conduct RMD training covering: 1. Identification of correct sources 2. Matching records between systems 3. Consolidation of duplicates 4. Conflict Resolution 5. Managing Changes using supporting technologies.","p":"P2"},{"d":"RMD","cid":"RMD.4","cn":"Data Lifecycle Management","sid":"RMD.4.1","sn":"RMD Stewardship Coverage","sd":"The Entity shall assign Business and IT Data Stewards to all identified Reference and Master Data Objects.","p":"P1"},{"d":"RMD","cid":"RMD.4","cn":"Data Lifecycle Management","sid":"RMD.4.2","sn":"RMD Data Lifecycle Management Process","sd":"The Entity shall establish a process for managing RMD Objects across the lifecycle covering: 1. Creation of new RMD Objects and instances 2. Modification of existing RMD Objects and instances 3. Archiving of RMD Objects and instances.","p":"P2"},{"d":"RMD","cid":"RMD.4","cn":"Data Lifecycle Management","sid":"RMD.4.3","sn":"RMD Data Hub Implementation","sd":"The Entity shall implement the RMD Hub as Trusted Source by: 1. Instantiating physical Data Hub components 2. Establishing Master Data Model 3. Loading RMD Objects into the Hub 4. Activating replication between sources and Hub 5. Activating synchr...","p":"P2"},{"d":"RMD","cid":"RMD.4","cn":"Data Lifecycle Management","sid":"RMD.4.4","sn":"Data Hub as Trusted Source","sd":"The Entity shall establish the Data Hub as the Entity's Trusted Source for any new information system and application requiring the use of the Entity's Reference and/or Master Data Objects.","p":"P2"},{"d":"RMD","cid":"RMD.5","cn":"Performance Management","sid":"RMD.5.1","sn":"RMD Service Level Agreements","sd":"The Entity shall establish SLAs for its RMD Data Lifecycle Management Process to effectively balance time vs. cost for changes to Reference and Master Data.","p":"P2"},{"d":"RMD","cid":"RMD.5","cn":"Performance Management","sid":"RMD.5.2","sn":"RMD Program KPIs","sd":"The Entity shall establish KPIs including: 1. Number of incorrect data values in Master Data Records 2. Mean Time to Repair (MTTR) RMD quality issues 3. Change request volumes for RMD Objects.","p":"P2"},{"d":"RMD","cid":"RMD.6","cn":"Artifacts","sid":"RMD.6.1","sn":"RMD Change Request Logs","sd":"The Entity shall document in a register reference and master data change request logs and the decisions made based on those requests.","p":"P2"},{"d":"RMD","cid":"RMD.6","cn":"Artifacts","sid":"RMD.6.2","sn":"RMD Initiative Planning Documents","sd":"The Entity shall document in a register Statement of Architecture Work documents for its Reference and Master Data initiatives.","p":"P2"},{"d":"BIA","cid":"BIA.1","cn":"Plan","sid":"BIA.1.1","sn":"Business Intelligence and Analytics Plan","sd":"The Entity shall create a BI and Analytics Plan including: 1. Roadmap with activities and key milestones 2. Assignment of required resources and budget.","p":"P1"},{"d":"BIA","cid":"BIA.1","cn":"Plan","sid":"BIA.1.2","sn":"BI and Analytics Use Case Identification and Prioritization","sd":"The Entity shall identify and prioritize BI and Analytics use cases through: 1. Ideation workshops with long list of documented use cases (name, description, entities involved) 2. Shortlisting based on prioritization framework with criteria such a...","p":"P1"},{"d":"BIA","cid":"BIA.1","cn":"Plan","sid":"BIA.1.3","sn":"BI and Analytics Use Case Detailing","sd":"The Entity shall detail shortlisted use cases with: 1. Objective 2. Type of Analytics (discovery, descriptive, diagnostic, predictive, prescriptive) 3. Expected benefits and ROI 4. Stakeholders 5. Business requirements 6. Data sources 7. Technolog...","p":"P1"},{"d":"BIA","cid":"BIA.1","cn":"Plan","sid":"BIA.1.4","sn":"BI and Analytics Use Case Implementation Plan","sd":"The Entity shall develop an implementation plan for each shortlisted use case addressing: 1. Functional and Non-Functional Requirements 2. High Level Design 3. Staging and Production Environment 4. Development 5. Testing 6. Deployment and Schedule...","p":"P1"},{"d":"BIA","cid":"BIA.2","cn":"Training and Awareness","sid":"BIA.2.1","sn":"Business Intelligence and Analytics Training","sd":"The Entity shall conduct BI and Analytics training covering: 1. Methods for gathering and organizing data 2. Model development and analytics tools 3. Data models and data flows 4. Types of graphical representation 5. Analytical models evaluation t...","p":"P2"},{"d":"BIA","cid":"BIA.2","cn":"Training and Awareness","sid":"BIA.2.2","sn":"Business Intelligence and Analytics Awareness","sd":"The Entity shall develop awareness campaigns covering: 1. Current Analytics Assets Available 2. BI and Analytics Success Stories 3. New Analytics and AI Tools and Workflows.","p":"P2"},{"d":"BIA","cid":"BIA.3","cn":"Data Lifecycle Management","sid":"BIA.3.1","sn":"Business Intelligence and Analytics Use Case Validation","sd":"The Entity shall define and conduct a validation process for use case outcomes addressing: 1. Functional and non-functional requirements 2. Personal Data Protection considerations 3. Return on investment vs. target.","p":"P2"},{"d":"BIA","cid":"BIA.3","cn":"Data Lifecycle Management","sid":"BIA.3.2","sn":"Data Science Team","sd":"The Entity shall leverage a Data Analytics Team to drive implementation of BI and Analytics specifications, typically including Data Scientists, Data Engineers, and Visualization Engineers.","p":"P2"},{"d":"BIA","cid":"BIA.4","cn":"Performance Management","sid":"BIA.4.1","sn":"Business Intelligence and Analytics KPIs","sd":"The Entity shall establish KPIs including: 1. Number of use cases defined 2. Number piloted 3. Number implemented and scaled 4. Total ROI value generated 5. Training and awareness sessions delivered.","p":"P2"},{"d":"BIA","cid":"BIA.5","cn":"Artifacts","sid":"BIA.5.1","sn":"Business Intelligence and Analytics Register","sd":"The Entity shall document in a register its BI and Analytics Use Cases, final review of outcomes delivered, and related process documentation with read access granted to all stakeholders.","p":"P3"},{"d":"DVR","cid":"DVR.1","cn":"Plan","sid":"DVR.1.1","sn":"Data Value Realization Use Cases","sd":"The Entity shall identify and document Data Value Realization Use Cases including: 1. Data Revenue Generation Use Cases 2. Cost Saving Use Cases. For each use case the Entity shall estimate and document the projected Payback period and Return on I...","p":"P1"},{"d":"DVR","cid":"DVR.1","cn":"Plan","sid":"DVR.1.2","sn":"Data Value Realization Plan","sd":"The Entity shall create a Data Value Realization Plan including: 1. Roadmap with activities and key milestones for implementation of DVR Use Cases 2. Assignment of required resources and budget.","p":"P1"},{"d":"DVR","cid":"DVR.2","cn":"Data Revenue Generation Process","sid":"DVR.2.1","sn":"Pricing Scheme Definition","sd":"The Entity shall, for each Data or Data Product expecting to generate revenue, select and document an appropriate Pricing Scheme Model based on the Data Revenue Framework Regulation.","p":"P2"},{"d":"DVR","cid":"DVR.2","cn":"Data Revenue Generation Process","sid":"DVR.2.2","sn":"Data or Data Product Price Calculation","sd":"The Entity shall calculate and document the Total Cost for each Data or Data Product including: 1. Data Collection Cost 2. Data Development Cost.","p":"P2"},{"d":"DVR","cid":"DVR.2","cn":"Data Revenue Generation Process","sid":"DVR.2.3","sn":"Charging Model Adoption","sd":"The Entity shall define and document the adopted Charging Model choosing from: 1. Subscription Model 2. Consumption-Based Model 3. Freemium/Premium Model 4. One-Time Fee Model.","p":"P2"},{"d":"DVR","cid":"DVR.2","cn":"Data Revenue Generation Process","sid":"DVR.2.4","sn":"Revenue Generation Request Submission","sd":"The Entity shall submit a revenue generation request to NDMO including: 1. Description of Data or Data Product 2. Pricing Scheme Documentation 3. Proposed Charging Model 4. Proposed Final Unit Price 5. Justification if price does not follow Cost R...","p":"P2"},{"d":"DVR","cid":"DVR.3","cn":"Monitoring and Maintenance","sid":"DVR.3.1","sn":"Data Value Realization Use Cases Monitoring and Maintenance","sd":"The Entity shall actively monitor and maintain DVR Use Cases including: 1. Measuring and validating KPIs (ROI and Payback Period) 2. Developing Change Request documents 3. Reporting defects or malfunctions.","p":"P3"},{"d":"DVR","cid":"DVR.4","cn":"Performance Management","sid":"DVR.4.1","sn":"Data Value Realization KPIs","sd":"The Entity shall establish KPIs including: 1. Number of Data Products developed 2. Revenue generation requests raised to NDMO 3. Data Products that generated revenue 4. Total revenue generated 5. Total cost saved 6. DVR Use Case Payback period 7. ...","p":"P2"},{"d":"OD","cid":"OD.1","cn":"Plan","sid":"OD.1.1","sn":"Open Data Plan","sd":"The Entity shall create an Open Data Plan including: 1. Roadmap with activities and key milestones for implementation of Open Data initiatives 2. Assignment of required resources and budget.","p":"P1"},{"d":"OD","cid":"OD.2","cn":"Training and Awareness","sid":"OD.2.1","sn":"Open Data Awareness","sd":"The Entity shall plan awareness campaigns covering: 1. Usage of Open Data and its social and economic benefits 2. Promoting Entity Open Data and related activities.","p":"P2"},{"d":"OD","cid":"OD.3","cn":"Data Lifecycle Management","sid":"OD.3.1","sn":"Open Data Processes","sd":"The Entity shall develop processes for the lifecycle of Open Data including: 1. Processes to identify public datasets 2. Processes to publish and maintain datasets in appropriate format 3. Processes for gathering feedback and improving national im...","p":"P1"},{"d":"OD","cid":"OD.3","cn":"Data Lifecycle Management","sid":"OD.3.2","sn":"Open Data Identification","sd":"The Entity shall, as part of identification: 1. Identify and prioritize all data classified as 'public' 2. Perform a valuation of identified datasets 3. Assess whether combination of publicly available data could allow unauthorized disclosure of p...","p":"P1"},{"d":"OD","cid":"OD.3","cn":"Data Lifecycle Management","sid":"OD.3.3","sn":"Open Data Publishing","sd":"The Entity shall publish datasets under the KSA Open Data License as referred to in the NDMO Open Data Regulation.","p":"P1"},{"d":"OD","cid":"OD.3","cn":"Data Lifecycle Management","sid":"OD.3.4","sn":"Open Data Metadata","sd":"The Entity shall identify and document the metadata necessary within the Open Dataset to easily identify, describe and search for it once published.","p":"P2"},{"d":"OD","cid":"OD.3","cn":"Data Lifecycle Management","sid":"OD.3.5","sn":"Open Data Format","sd":"The Entity shall use standardized formats when publishing datasets in machine-readable form including: 1. CSV 2. JSON 3. XML 4. RDF. Datasets shall be accompanied by documentation containing instructions on how to use them.","p":"P1"},{"d":"OD","cid":"OD.3","cn":"Data Lifecycle Management","sid":"OD.3.6","sn":"Open Data Maintenance","sd":"The Entity shall, as part of maintenance: 1. Regularly update and document changes to published Open Datasets 2. Perform continuous review for regulatory compliance 3. Maintain data traceability by documenting data provenance and versioning history.","p":"P3"},{"d":"OD","cid":"OD.4","cn":"Performance Management","sid":"OD.4.1","sn":"Open Data KPIs","sd":"The Entity shall establish KPIs including: 1. Number of downloads per dataset 2. Number of identified and prioritized Open Datasets 3. Number of identified datasets that have been published 4. Number of updates performed on published datasets.","p":"P2"},{"d":"OD","cid":"OD.5","cn":"Artifacts","sid":"OD.5.1","sn":"Open Data Register","sd":"The Entity shall document in a register the list of all its identified Open Datasets combined with a log of open data activities conducted and decisions taken during the Data Lifecycle Management process.","p":"P2"},{"d":"FOI","cid":"FOI.1","cn":"Plan","sid":"FOI.1.1","sn":"FOI Plan","sd":"The Entity shall create a Freedom of Information Plan including: 1. Roadmap with activities and key milestones for achieving and maintaining compliance with NDMO Freedom of Information Regulations 2. Assignment of required resources and budget.","p":"P1"},{"d":"FOI","cid":"FOI.2","cn":"Training and Awareness","sid":"FOI.2.1","sn":"FOI Awareness","sd":"The Entity shall launch awareness campaigns including: 1. Raising awareness across employees involved in processing FOI Access Requests 2. Raising awareness of Freedom of Information Principles and Saudi citizens' rights.","p":"P2"},{"d":"FOI","cid":"FOI.3","cn":"Data Lifecycle Management","sid":"FOI.3.1","sn":"FOI Request Process Design","sd":"The Entity shall design and document a standardized Request for Information Process to manage, process and document requests to access Public Information according to NDMO Freedom of Information Regulations.","p":"P1"},{"d":"FOI","cid":"FOI.3","cn":"Data Lifecycle Management","sid":"FOI.3.2","sn":"FOI Request Process Implementation","sd":"The Entity shall establish and follow a clear process to manage requests to access Public Information, making one of the following decisions: 1. Grant the access 2. Deny the request 3. Extend the time required 4. Notify Requestor if information is...","p":"P1"},{"d":"FOI","cid":"FOI.3","cn":"Data Lifecycle Management","sid":"FOI.3.3","sn":"Public Entity Publication","sd":"The Entity shall publish on its official Government website: 1. Laws and regulations applicable to the Entity 2. Entity's services provided 3. Organizational structure 4. Job vacancy information 5. Annual key reports 6. General statistics 7. Conta...","p":"P3"},{"d":"FOI","cid":"FOI.3","cn":"Data Lifecycle Management","sid":"FOI.3.4","sn":"Access Request Forms","sd":"The Entity shall prepare request forms for access to Public Information including: 1. Requestor information (name, address, national ID) 2. Description of Public Information requested 3. Purpose behind the request 4. Legal basis 5. Notice delivery...","p":"P1"},{"d":"FOI","cid":"FOI.3","cn":"Data Lifecycle Management","sid":"FOI.3.5","sn":"Information Fees Determination","sd":"The Entity shall, for each granted Public Information Access Request, calculate and document a processing fee by adopting a Pricing Scheme as defined in the NDMO Data Value Realization Regulation.","p":"P2"},{"d":"FOI","cid":"FOI.3","cn":"Data Lifecycle Management","sid":"FOI.3.6","sn":"Compliance Monitoring","sd":"The Entity shall conduct internal audits to monitor compliance with NDMO Freedom of Information Regulations and document findings in a report to the Open Data and Information Access Officer. Non-compliance requires corrective actions with notifica...","p":"P2"},{"d":"FOI","cid":"FOI.4","cn":"Artifacts","sid":"FOI.4.1","sn":"FOI Register Records","sd":"The Entity shall document compliance records in a register including: 1. Information on current Open Data and Information Access Officer 2. Public Information Access Requests Records 3. Public Entity Publication 4. Any other records required by ND...","p":"P3"},{"d":"DC","cid":"DC.1","cn":"Plan","sid":"DC.1.1","sn":"Data Classification Plan","sd":"The Entity shall create a Data Classification Plan including: 1. Roadmap with activities and key milestones for classification of Entity's data 2. Assignment of required resources and budget.","p":"P1"},{"d":"DC","cid":"DC.1","cn":"Plan","sid":"DC.1.2","sn":"Data Classification Prioritization","sd":"The Entity shall prioritize datasets and artifacts to be classified resulting in a list of ranked datasets and artifacts establishing an order of the Entity's Data Classification.","p":"P1"},{"d":"DC","cid":"DC.2","cn":"Classification Controls","sid":"DC.2.1","sn":"Security Controls","sd":"The Entity shall assign data handling and protection controls to datasets and artifacts based on their classification level by following the National Cybersecurity Authority (NCA) regulations.","p":"As specified by NCA"},{"d":"DC","cid":"DC.3","cn":"Classification Process","sid":"DC.3.1","sn":"Data Identification","sd":"The Entity shall identify and inventory all datasets and artifacts owned by the Entity as part of the Data Classification Implementation process. If the Data Catalog automated tool is implemented, it shall be used for this inventory.","p":"P1"},{"d":"DC","cid":"DC.3","cn":"Classification Process","sid":"DC.3.2","sn":"Impact Assessment","sd":"The Entity shall conduct an impact assessment including: 1. Identification of impacted categories (national interest, organizations, individuals, environment) 2. Selection of impact level (High, Medium, Low, None) 3. Assignment of classification l...","p":"P1"},{"d":"DC","cid":"DC.3","cn":"Classification Process","sid":"DC.3.3","sn":"Assessment for Low Impact Data","sd":"The Entity shall assess possibility to classify 'Low' impact data as 'Public' including: 1. Evaluation if disclosure is in breach of any regulation 2. Identify potential benefits and whether they outweigh negative impacts. If not in breach and ben...","p":"P1"},{"d":"DC","cid":"DC.3","cn":"Classification Process","sid":"DC.3.4","sn":"Data Classification Review","sd":"The Entity shall review all classified datasets and artifacts to ensure classification levels assigned are the most appropriate ones following the NDMO Data Classification Regulation.","p":"P2"},{"d":"DC","cid":"DC.3","cn":"Classification Process","sid":"DC.3.5","sn":"Data Classification Metadata","sd":"The Entity shall publish classification levels assigned to its datasets and artifacts as metadata registered within the Data Catalog automated tool.","p":"P2"},{"d":"DC","cid":"DC.4","cn":"Performance Management","sid":"DC.4.1","sn":"Data Classification KPIs","sd":"The Entity shall establish KPIs including: 1. % of datasets and artifacts classified 2. % of datasets and artifacts classified by classification level 3. % of 'Low' impact data classified as 'Confidential' 4. % of classified datasets and artifacts...","p":"P2"},{"d":"DC","cid":"DC.5","cn":"Artifacts","sid":"DC.5.1","sn":"Data Register","sd":"The Entity shall document in a register all datasets and artifacts combined with a log of Data Classification activities including: 1. List of identified datasets 2. Classification levels assigned 3. Dates of assignment 4. Classification duration ...","p":"P2"},{"d":"PDP","cid":"PDP.1","cn":"Plan","sid":"PDP.1.1","sn":"Personal Data Protection Initial Assessment","sd":"The Entity shall perform an initial Personal Data Protection Assessment including: 1. Identification of types of personal data being collected 2. Location and method of storage 3. Current processing and uses 4. Privacy challenges for compliance wi...","p":"P1"},{"d":"PDP","cid":"PDP.1","cn":"Plan","sid":"PDP.1.2","sn":"Personal Data Protection Plan","sd":"The Entity shall create a Personal Data Protection Plan including: 1. Roadmap with activities and key milestones for achieving and maintaining compliance with NDMO Personal Data Protection Regulations 2. Assignment of required resources and budget.","p":"P1"},{"d":"PDP","cid":"PDP.2","cn":"Training and Awareness","sid":"PDP.2.1","sn":"Personal Data Protection Training","sd":"The Entity shall conduct training for every employee covering: 1. Importance and consequences of Personal Data Protection 2. Definition of Personal Data 3. Data Subject Data Rights 4. Entity and Data Subject Responsibilities 5. Notifications requi...","p":"P1"},{"d":"PDP","cid":"PDP.3","cn":"Data Breach","sid":"PDP.3.1","sn":"Data Breach Notification","sd":"The Entity's Data Controller or Data Processor shall, upon determining personal data has been compromised, notify the Regulatory Authority within 72 hours as specified in NDMO Personal Data Protection Regulations.","p":"P2"},{"d":"PDP","cid":"PDP.3","cn":"Data Breach","sid":"PDP.3.2","sn":"Data Breach Management Process","sd":"The Entity shall develop breach management procedures including: 1. Conducting an incident review by the Data Controller with the Regulatory Authority 2. Formulating an immediate response 3. Implementing permanent corrective actions 4. Conducting ...","p":"P1"},{"d":"PDP","cid":"PDP.4","cn":"Data Lifecycle Management","sid":"PDP.4.1","sn":"Privacy Notice and Consent Management","sd":"The Entity shall establish components including: 1. Processes for providing Data Subjects with notice and requesting consent 2. Providing all options to Data Subjects for approval 3. Documenting and making available a Privacy Notice 4. Maintaining...","p":"P2"},{"d":"PDP","cid":"PDP.4","cn":"Data Lifecycle Management","sid":"PDP.4.2","sn":"Data Subject Rights","sd":"The Entity shall establish Data Subject Rights Management processes supporting: 1. Right to be informed 2. Right to access 3. Right to rectification 4. Right to erasure 5. Right to object 6. Right to restrict processing 7. Right to data portability.","p":"P2"},{"d":"PDP","cid":"PDP.4","cn":"Data Lifecycle Management","sid":"PDP.4.3","sn":"Personal Data Protection Risk Assessments","sd":"The Entity shall conduct yearly risk assessments of information systems containing personal data. Findings shall be: 1. Documented 2. Analyzed for impact and likelihood 3. Evaluated against current regulations and criticality.","p":"P3"},{"d":"PDP","cid":"PDP.4","cn":"Data Lifecycle Management","sid":"PDP.4.4","sn":"Compliance Monitoring and Audit","sd":"The Entity shall conduct internal audits to monitor compliance with privacy regulations and document findings to the Data Protection Officer. Non-compliance requires corrective actions with notification to the Regulatory Authority and NDMO.","p":"P2"},{"d":"PDP","cid":"PDP.5","cn":"Artifacts","sid":"PDP.5.1","sn":"Personal Data Protection Register","sd":"The Entity shall document compliance records for at least 24 months and make them available when requested by NDMO. The register shall include, at minimum, a record of any collection and/or processing of any personal data.","p":"P2"},{"d":"DS","cid":"DS.1","cn":"Information Security Governance","sid":"DS.1.1","sn":"Information Security Governance","sd":"Governed by the National Cybersecurity Authority (NCA). Compliance to Data Security and Protection controls will be conducted by NCA as per their requirements and methodology. Not part of NDMO's annual compliance assessment.","p":"As specified by NCA"},{"d":"DS","cid":"DS.2","cn":"Information Security Architecture","sid":"DS.2.1","sn":"Information Security Architecture","sd":"Governed by the National Cybersecurity Authority (NCA). Compliance to Data Security and Protection controls will be conducted by NCA as per their requirements and methodology.","p":"As specified by NCA"},{"d":"DS","cid":"DS.3","cn":"Information Systems Design, Development and Testing","sid":"DS.3.1","sn":"Information Systems Design, Development and Testing","sd":"Governed by the National Cybersecurity Authority (NCA). Compliance to Data Security and Protection controls will be conducted by NCA as per their requirements and methodology.","p":"As specified by NCA"},{"d":"DS","cid":"DS.4","cn":"Identity and Access Management","sid":"DS.4.1","sn":"Identity and Access Management","sd":"Governed by the National Cybersecurity Authority (NCA). Compliance to Data Security and Protection controls will be conducted by NCA as per their requirements and methodology.","p":"As specified by NCA"},{"d":"DS","cid":"DS.5","cn":"Third Party Supplier Security","sid":"DS.5.1","sn":"Third Party Supplier Security","sd":"Governed by the National Cybersecurity Authority (NCA). Compliance to Data Security and Protection controls will be conducted by NCA as per their requirements and methodology.","p":"As specified by NCA"},{"d":"DS","cid":"DS.6","cn":"Information Security Training, Awareness and Communication","sid":"DS.6.1","sn":"Information Security Training, Awareness and Communication","sd":"Governed by the National Cybersecurity Authority (NCA). Compliance to Data Security and Protection controls will be conducted by NCA as per their requirements and methodology.","p":"As specified by NCA"},{"d":"DS","cid":"DS.7","cn":"Information Asset Management","sid":"DS.7.1","sn":"Information Asset Management","sd":"Governed by the National Cybersecurity Authority (NCA). Compliance to Data Security and Protection controls will be conducted by NCA as per their requirements and methodology.","p":"As specified by NCA"},{"d":"DS","cid":"DS.8","cn":"Information Security Operations Management","sid":"DS.8.1","sn":"Information Security Operations Management","sd":"Governed by the National Cybersecurity Authority (NCA). Compliance to Data Security and Protection controls will be conducted by NCA as per their requirements and methodology.","p":"As specified by NCA"},{"d":"DS","cid":"DS.9","cn":"Information Security Incident Management","sid":"DS.9.1","sn":"Information Security Incident Management","sd":"Governed by the National Cybersecurity Authority (NCA). Compliance to Data Security and Protection controls will be conducted by NCA as per their requirements and methodology.","p":"As specified by NCA"},{"d":"DS","cid":"DS.10","cn":"Information Security Risk Management","sid":"DS.10.1","sn":"Information Security Risk Management","sd":"Governed by the National Cybersecurity Authority (NCA). Compliance to Data Security and Protection controls will be conducted by NCA as per their requirements and methodology.","p":"As specified by NCA"},{"d":"DS","cid":"DS.11","cn":"Information Systems Continuity Management","sid":"DS.11.1","sn":"Information Systems Continuity Management","sd":"Governed by the National Cybersecurity Authority (NCA). Compliance to Data Security and Protection controls will be conducted by NCA as per their requirements and methodology. (ISO 27001)","p":"As specified by NCA"}];

// ═══ Base Domain Structure ═══
const DOMAIN_DEFS = [
  { id:"DG", name:"Data Governance", controls:8, specs:28, p1:18, p2:9, p3:1 },
  { id:"MCM", name:"Data Catalog & Metadata", controls:6, specs:20, p1:5, p2:13, p3:2 },
  { id:"DQ", name:"Data Quality", controls:4, specs:13, p1:3, p2:8, p3:2 },
  { id:"DO", name:"Data Operations", controls:5, specs:14, p1:3, p2:10, p3:1 },
  { id:"DCM", name:"Document & Content Mgmt", controls:5, specs:12, p1:5, p2:4, p3:3 },
  { id:"DAM", name:"Data Architecture & Modeling", controls:4, specs:9, p1:3, p2:6, p3:0 },
  { id:"DSI", name:"Data Sharing & Interop", controls:8, specs:16, p1:6, p2:8, p3:2 },
  { id:"RMD", name:"Reference & Master Data", controls:6, specs:18, p1:8, p2:9, p3:1 },
  { id:"BIA", name:"Business Intelligence", controls:5, specs:10, p1:4, p2:5, p3:1 },
  { id:"DVR", name:"Data Value Realization", controls:4, specs:8, p1:2, p2:5, p3:1 },
  { id:"OD", name:"Open Data", controls:5, specs:10, p1:4, p2:4, p3:2 },
  { id:"FOI", name:"Freedom of Information", controls:4, specs:9, p1:4, p2:3, p3:2 },
  { id:"DC", name:"Data Classification", controls:5, specs:10, p1:5, p2:3, p3:0 },
  { id:"PDP", name:"Personal Data Protection", controls:5, specs:10, p1:5, p2:4, p3:1 },
  { id:"DS", name:"Data Security & Protection", controls:11, specs:11, p1:0, p2:0, p3:0, nca:11 },
];

// ═══ Business Units with Sectors ═══
const BUS = [
  { id:"EW", name:"Energy and Water", icon:"⚡", maturity:72,
    sectors:[
      {id:"EW-REN",name:"Renewable Energy"},{id:"EW-HGF",name:"Hydrogen & Green Fuels"},
      {id:"EW-WDS",name:"Water Desalination"},{id:"EW-PGD",name:"Power Grid & Distribution"},
      {id:"EW-ESG",name:"Energy Storage"},{id:"EW-WTR",name:"Water Treatment & Recycling"},
      {id:"EW-OGT",name:"Oil & Gas Transition"},{id:"EW-SMT",name:"Smart Metering"},
      {id:"EW-EEF",name:"Energy Efficiency"},{id:"EW-WDN",name:"Water Distribution Networks"}
    ]},
  { id:"TD", name:"Tech and Digital", icon:"💻", maturity:82,
    sectors:[
      {id:"TD-CLD",name:"Cloud Infrastructure"},{id:"TD-CYB",name:"Cybersecurity Operations"},
      {id:"TD-AIM",name:"AI & Machine Learning"},{id:"TD-IOT",name:"IoT & Smart Systems"},
      {id:"TD-DPL",name:"Digital Platforms"},{id:"TD-DCO",name:"Data Center Operations"},
      {id:"TD-SWE",name:"Software Engineering"},{id:"TD-NET",name:"Network & Telecom"},
      {id:"TD-DTS",name:"Digital Twin & Simulation"},{id:"TD-BLC",name:"Blockchain & DLT"}
    ]},
  { id:"HW", name:"Health and Wellbeing", icon:"🏥", maturity:65,
    sectors:[
      {id:"HW-PHC",name:"Primary Healthcare"},{id:"HW-HOP",name:"Hospital Operations"},
      {id:"HW-PHA",name:"Pharmaceutical Services"},{id:"HW-MRE",name:"Medical Research"},
      {id:"HW-MHS",name:"Mental Health Services"},{id:"HW-PUB",name:"Public Health & Epidemiology"},
      {id:"HW-HIN",name:"Health Insurance"},{id:"HW-MDE",name:"Medical Devices & Equipment"},
      {id:"HW-TEL",name:"Telemedicine"},{id:"HW-WSM",name:"Wellness & Sports Medicine"}
    ]},
  { id:"CF", name:"Corporate Functions", icon:"🏢", maturity:58,
    sectors:[
      {id:"CF-HRD",name:"Human Resources"},{id:"CF-FIN",name:"Finance & Accounting"},
      {id:"CF-LEG",name:"Legal & Compliance"},{id:"CF-PRO",name:"Procurement"},
      {id:"CF-AUD",name:"Internal Audit"},{id:"CF-RSK",name:"Risk Management"},
      {id:"CF-STR",name:"Corporate Strategy"},{id:"CF-COM",name:"Corporate Communications"},
      {id:"CF-FAC",name:"Facilities Management"},{id:"CF-ITS",name:"IT Shared Services"}
    ]},
];

// Flatten for lookups
const ALL_SECTORS = BUS.flatMap(bu => bu.sectors.map(s => ({...s, buId:bu.id, buName:bu.name, buIcon:bu.icon, buMaturity:bu.maturity})));
function getSector(sectorId) { return ALL_SECTORS.find(s => s.id === sectorId); }
function getBUForSector(sectorId) { return BUS.find(bu => bu.sectors.some(s => s.id === sectorId)); }

const MONTHS = ["Oct","Nov","Dec","Jan","Feb","Mar"];

// Generate domain compliance scores for a sector using deterministic seed
function sHash(str) { let h=0; for(let i=0;i<str.length;i++){h=((h<<5)-h)+str.charCodeAt(i);h|=0;} return Math.abs(h); }
function sectorDomainScore(sectorId, domainId, maturity) {
  const h = sHash(sectorId + domainId);
  const variance = ((h % 40) - 20); // -20 to +19
  return Math.max(15, Math.min(98, maturity + variance));
}
function sectorTrend(base) {
  const step = Math.max(2, Math.round(base * 0.04));
  return [base-5*step, base-4*step, base-3*step, base-2*step, base-step, base].map(v=>Math.max(10,Math.min(98,v)));
}
function getDomainsForSector(sectorId) {
  const sec = getSector(sectorId);
  if (!sec) return DOMAIN_DEFS.map(d=>({...d,compliance:50,trend:[40,42,44,46,48,50]}));
  return DOMAIN_DEFS.map(d => {
    const c = sectorDomainScore(sectorId, d.id, sec.buMaturity);
    return {...d, compliance:c, trend:sectorTrend(c)};
  });
}
function getDomainsForBU(bu) {
  // Aggregate: average across all sectors
  return DOMAIN_DEFS.map(d => {
    const scores = bu.sectors.map(s => sectorDomainScore(s.id, d.id, bu.maturity));
    const avg = Math.round(scores.reduce((a,v)=>a+v,0)/scores.length);
    return {...d, compliance:avg, trend:sectorTrend(avg)};
  });
}
function getSpecsForDomain(domainId) { return NDMO_SPECS.filter(s => s.d === domainId); }

function assignStatuses(specs, compliance) {
  let seed = compliance * 7 + (specs[0]?.sid?.charCodeAt(3) || 0);
  const pr = () => { seed = (seed * 16807 + 11) % 2147483647; return (seed & 0x7fffffff) / 0x7fffffff; };
  return specs.map(s => {
    const r = pr(); const c = compliance / 100;
    let status;
    if (r < c * 0.85) status = "Compliant";
    else if (r < c * 0.85 + 0.22) status = "Partially Compliant";
    else if (r < c * 0.85 + 0.35) status = "Non-Compliant";
    else status = "Not Applicable";
    return { ...s, status };
  });
}

function getActivityForBU(bu) {
  const actions=[{t:"Assessment completed",type:"complete"},{t:"Control updated",type:"update"},{t:"Gap analysis flagged",type:"alert"},{t:"Evidence uploaded",type:"upload"},{t:"Risk escalation raised",type:"alert"},{t:"Remediation approved",type:"complete"}];
  const users=["Sara A.","Ahmed M.","Nora K.","Khalid R.","Fatima S.","System"];
  const times=["1h ago","3h ago","5h ago","8h ago","1d ago","2d ago"];
  const doms=getDomainsForBU(bu);
  return actions.map((a,i)=>({domain:doms[i%doms.length].id,action:a.t,user:users[i],time:times[i],type:a.type}));
}

// ═══ Helpers ═══
const gc = v => v >= 70 ? "#059669" : v >= 50 ? "#d97706" : "#dc2626";
const gbg = v => v >= 70 ? "#ecfdf5" : v >= 50 ? "#fffbeb" : "#fef2f2";
const gl = v => v >= 70 ? "GOOD" : v >= 50 ? "ATTENTION" : "AT RISK";

function computeKpis(domains) {
  const overall=Math.round(domains.reduce((a,d)=>a+d.compliance,0)/domains.length);
  const atRisk=domains.filter(d=>d.compliance<50).length;
  const ts=domains.reduce((a,d)=>a+d.specs,0);
  const p1T=domains.reduce((a,d)=>a+d.p1,0);
  const p1C=p1T>0?Math.round(domains.filter(d=>d.p1>0).reduce((a,d)=>a+d.compliance*d.p1,0)/p1T):0;
  return {overall,atRisk,ts,p1C};
}

const STATUS_COLORS = {"Compliant":"#059669","Partially Compliant":"#d97706","Non-Compliant":"#dc2626","Not Applicable":"#94a3b8","Ready for Review":"#6366f1"};
const STATUS_BG = {"Compliant":"#ecfdf5","Partially Compliant":"#fffbeb","Non-Compliant":"#fef2f2","Not Applicable":"#f3f4f6","Ready for Review":"#eef2ff"};
function StatusIcon({status,size:sz}) {
  const s=sz||14;
  if(status==="Compliant") return <CheckCircle size={s} color="#059669"/>;
  if(status==="Partially Compliant") return <Clock size={s} color="#d97706"/>;
  if(status==="Non-Compliant") return <AlertTriangle size={s} color="#dc2626"/>;
  if(status==="Ready for Review") return <Eye size={s} color="#6366f1"/>;
  return <span style={{width:s,height:s,display:"inline-block",borderRadius:"50%",background:"#d1d5db"}}/>;
}

// ═══ Shared Components ═══
function StatusDot({value}) { return <span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",background:gc(value),marginRight:8,flexShrink:0}}/>; }

function KpiCard({icon,label,value,sub,accent}) {
  return (
    <div style={{background:"#fff",borderRadius:16,padding:"20px 22px",boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0",flex:1,minWidth:170}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <div style={{background:accent||"#f0fdf4",borderRadius:10,padding:7,display:"flex"}}>{icon}</div>
        <span style={{fontSize:11,color:"#6b7280",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>{label}</span>
      </div>
      <div style={{fontSize:28,fontWeight:800,color:"#111827",letterSpacing:"-0.02em",fontFamily:"'DM Sans',sans-serif"}}>{value}</div>
      {sub && <div style={{fontSize:11,color:"#9ca3af",marginTop:3}}>{sub}</div>}
    </div>
  );
}

function Badge({value}) { return <span style={{display:"inline-block",padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:700,letterSpacing:"0.05em",color:gc(value),background:gbg(value)}}>{gl(value)}</span>; }

function StatusBadge({status, lang}) {
  return <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 8px",borderRadius:6,background:STATUS_BG[status]||"#f3f4f6",width:"fit-content"}}><StatusIcon status={status}/><span style={{fontSize:11,fontWeight:600,color:STATUS_COLORS[status]||"#6b7280"}}>{status==="Compliant"?t("compliant",typeof lang!=="undefined"?lang:"en"):status==="Partially Compliant"?t("partiallyCompliant",typeof lang!=="undefined"?lang:"en"):status==="Non-Compliant"?t("nonCompliant",typeof lang!=="undefined"?lang:"en"):status==="Not Applicable"?t("notApplicable",typeof lang!=="undefined"?lang:"en"):status}</span></div>;
}

const WORKFLOW_COLORS = {"Open":"#d97706","Ready for Review":"#6366f1","Closed":"#059669"};
const WORKFLOW_BG = {"Open":"#fffbeb","Ready for Review":"#eef2ff","Closed":"#ecfdf5"};
function WorkflowBadge({wf, lang}) {
  return <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 8px",borderRadius:6,background:WORKFLOW_BG[wf]||"#f3f4f6",width:"fit-content"}}><span style={{width:8,height:8,borderRadius:"50%",background:WORKFLOW_COLORS[wf]||"#9ca3af",display:"inline-block"}}/><span style={{fontSize:11,fontWeight:600,color:WORKFLOW_COLORS[wf]||"#6b7280"}}>{wf==="Open"?t("workflowOpen",typeof lang!=="undefined"?lang:"en"):wf==="Ready for Review"?t("workflowReady",typeof lang!=="undefined"?lang:"en"):wf==="Closed"?t("workflowClosed",typeof lang!=="undefined"?lang:"en"):wf}</span></div>;
}
const COMPLIANCE_OPTS = ["Compliant","Partially Compliant","Non-Compliant","Not Applicable"];

// ═══ SECTOR-LEVEL STEWARDS & CONTROLS (Generated) ═══
const NAME_POOL = [
  "Nora K.","Ahmed M.","Sara A.","Khalid R.","Fatima S.","Omar T.","Layla H.","Tariq N.",
  "Reem S.","Yousef A.","Huda M.","Saad K.","Noura R.","Majed T.","Lina W.","Mona A.",
  "Faisal D.","Aisha K.","Saleh B.","Dana M.","Waleed H.","Suha N.","Lama T.","Nawaf S.",
  "Ghada K.","Rania F.","Mansour A.","Dalal H.","Bader W.","Yara S.","Ziad R.","Mai A.",
  "Hamad N.","Nadia K.","Ali M.","Hanan J.","Turki M.","Asma B.","Joud L.","Rayan O.",
  "Lujain T.","Muath S.","Shahd A.","Meshal K.","Deema R.","Fahad W.","Abeer N.","Tala M.",
  "Bandar H.","Njoud F.","Sultan Q.","Razan D.","Feras G.","Lamia B.","Naif Y.","Hayat Z.",
  "Sami E.","Arwa P.","Basil J.","Rawya C."
];
const DOMAIN_NAMES_MAP = {DG:"Data Governance",MCM:"Data Catalog & Metadata",DQ:"Data Quality",DO:"Data Operations",DCM:"Document & Content Mgmt",DAM:"Data Architecture & Modeling",DSI:"Data Sharing & Interop",RMD:"Reference & Master Data",BIA:"Business Intelligence",DVR:"Data Value Realization",OD:"Open Data",FOI:"Freedom of Information",DC:"Data Classification",PDP:"Personal Data Protection",DS:"Data Security & Protection"};

function getStewardsForSector(sectorId) {
  const h = sHash(sectorId);
  const count = 3 + (h % 3); // 3-5 stewards
  const startIdx = h % (NAME_POOL.length - 6);
  const statuses = ["online","online","online","away","offline"];
  const domainIds = Object.keys(DOMAIN_NAMES_MAP);
  return Array.from({length:count}, (_,i) => {
    const ni = (startIdx + i * 7) % NAME_POOL.length;
    const name = NAME_POOL[ni];
    const fname = name.split(" ")[0].toLowerCase();
    const lname = name.split(" ")[1]?.toLowerCase() || "x";
    return {
      name,
      email: fname + "." + lname + "@neom.sa",
      domain: DOMAIN_NAMES_MAP[domainIds[(h + i * 3) % (domainIds.length - 1)]],
      status: statuses[i % statuses.length],
    };
  });
}

// Unique control IDs across all 85 controls
const ALL_CONTROLS = [];
DOMAIN_DEFS.forEach(d => {
  for(let c=1; c<=d.controls; c++) ALL_CONTROLS.push({cid:`${d.id}.${c}`, domain:d.id, domainName:d.name});
});

function generateControlsForSector(sectorId) {
  const h = sHash(sectorId);
  const sec = getSector(sectorId);
  const maturity = sec?.buMaturity || 60;
  const count = 5 + (h % 4); // 5-8 controls
  const stewards = getStewardsForSector(sectorId);
  const startIdx = h % ALL_CONTROLS.length;
  const statuses = ["Non-Compliant","Non-Compliant","Compliant","Partially Compliant","Non-Compliant","Not Applicable","Non-Compliant"];
  const workflows = ["Open","Open","Closed","Ready for Review","Open","Closed","Open"];
  const priorities = ["P1","P1","P1","P2","P1","P2","P2","P3"];
  const dates = ["2025-10-15","2025-11-01","2025-11-15","2025-12-01","2025-12-15","2026-01-01","2026-01-15","2026-02-01"];

  const ctrls = [];
  const usedCids = new Set();
  for (let i=0; i<count; i++) {
    let ci = (startIdx + i * 11) % ALL_CONTROLS.length;
    while (usedCids.has(ALL_CONTROLS[ci].cid)) ci = (ci + 1) % ALL_CONTROLS.length;
    const base = ALL_CONTROLS[ci];
    usedCids.add(base.cid);
    const steward = stewards[i % stewards.length];
    const si = (h + i * 7) % 7;
    const status = statuses[si];
    const wf = workflows[si];
    const proposed = wf === "Ready for Review" ? (si % 2 === 0 ? "Partially Compliant" : "Compliant") : wf === "Closed" ? status : null;

    // Find matching spec for description
    const spec = NDMO_SPECS.find(s => s.cid === base.cid);
    const desc = spec ? (spec.cn + ": " + spec.sd.substring(0, 200)) : "Control specification for " + base.cid;

    const comments = [];
    const auditLog = [{action:"Control assigned to " + steward.name + " — Workflow: Open", time:dates[i%dates.length]}];
    if (wf === "Ready for Review") {
      comments.push({from:steward.name, text:"Evidence uploaded. Proposing " + proposed + ".", time:"Feb 2026"});
      comments.push({from:"System", text:"Submitted for review — Proposed: " + proposed, time:"Feb 2026"});
      auditLog.push({action:"Steward proposed: " + proposed + " — Ready for Review", time:"Feb 2026"});
    } else if (wf === "Closed") {
      comments.push({from:"System", text:"Admin closed — Status: " + status, time:"Jan 2026"});
      auditLog.push({action:"Admin closed: " + status + " — Workflow: Closed", time:"Jan 2026"});
    }
    const evidence = wf !== "Open" ? [base.cid.replace(".","-") + "_Evidence.pdf"] : [];

    ctrls.push({
      cid:base.cid, cn:spec?.cn || base.cid, domain:base.domain, domainName:base.domainName,
      priority:priorities[i%priorities.length], status, proposedStatus:proposed, workflow:wf,
      assignedDate:dates[i%dates.length], controlDesc:desc, steward:steward.name,
      comments, auditLog, evidence
    });
  }
  return ctrls;
}

// ═══ Dynamic Compliance Calculation ═══
function getDomainsForSectorWithControls(sectorId, sectorControls) {
  const domains = getDomainsForSector(sectorId);
  const statusWeight = {"Compliant":1,"Partially Compliant":0.5,"Non-Compliant":0,"Not Applicable":0};
  return domains.map(d => {
    let base = d.compliance;
    const domCtrls = sectorControls.filter(c => c.domain === d.id && c.workflow === "Closed");
    domCtrls.forEach(c => {
      const w = statusWeight[c.status] || 0;
      base = base + (w * 3); // small boost per closed compliant control
    });
    return {...d, compliance:Math.max(0,Math.min(100,Math.round(base)))};
  });
}

function getCurrentSteward(sectorId) {
  const stewards = getStewardsForSector(sectorId);
  return stewards[0] ? {name:stewards[0].name, email:stewards[0].email, role:"Business Data Steward"} : {name:"Unknown",email:"",role:"Data Steward"};
}

function getStewardActions(controls) {
  return controls.filter(c => c.workflow === "Open").slice(0, 5).map(c => ({
    action: c.evidence.length === 0 ? "Upload evidence for " + c.cid : "Prepare submission for " + c.cid,
    type: c.evidence.length === 0 ? "upload" : "update", time:"Open", domain:c.domain,
  }));
}

// ═══ SHARED CONTROL DETAIL VIEW ═══
function ControlDetailView({ctrl, ctrlIdx, controls, setControls, viewer, onBack, lang}) {
  const [commentText, setCommentText] = useState("");
  const [tab, setTab] = useState("comments");
  const [selectedStatus, setSelectedStatus] = useState(ctrl.proposedStatus || "Compliant");
  const [adminCloseStatus, setAdminCloseStatus] = useState(ctrl.proposedStatus || ctrl.status);
  const isAdmin = viewer === "admin";
  const senderName = isAdmin ? "Admin" : ctrl.steward;

  const addComment = () => {
    if (!commentText.trim()) return;
    const updated = [...controls];
    updated[ctrlIdx] = {...updated[ctrlIdx], comments:[...updated[ctrlIdx].comments, {from:senderName, text:commentText, time:"Just now"}], auditLog:[...updated[ctrlIdx].auditLog, {action:"Comment by "+senderName, time:"Just now"}]};
    setControls(updated);
    setCommentText("");
  };

  // Steward: submit for review with proposed status
  const submitForReview = () => {
    const updated = [...controls];
    updated[ctrlIdx] = {...updated[ctrlIdx], workflow:"Ready for Review", proposedStatus:selectedStatus,
      auditLog:[...updated[ctrlIdx].auditLog, {action:"Steward proposed: "+selectedStatus+" — Workflow: Ready for Review", time:"Just now"}],
      comments:[...updated[ctrlIdx].comments, {from:"System", text:"Steward submitted for review — Proposed: "+selectedStatus, time:"Just now"}]};
    setControls(updated);
  };

  // Admin: close (accept or override status)
  const closeControl = () => {
    const updated = [...controls];
    updated[ctrlIdx] = {...updated[ctrlIdx], status:adminCloseStatus, workflow:"Closed",
      auditLog:[...updated[ctrlIdx].auditLog, {action:"Admin closed — Status: "+adminCloseStatus+" — Workflow: Closed", time:"Just now"}],
      comments:[...updated[ctrlIdx].comments, {from:"System", text:"Admin closed control — Status: "+adminCloseStatus, time:"Just now"}]};
    setControls(updated);
  };

  // Admin: reopen (send back to steward)
  const reopenControl = () => {
    const updated = [...controls];
    updated[ctrlIdx] = {...updated[ctrlIdx], workflow:"Open", proposedStatus:null,
      auditLog:[...updated[ctrlIdx].auditLog, {action:"Admin reopened — Workflow: Open (returned to steward)", time:"Just now"}],
      comments:[...updated[ctrlIdx].comments, {from:"System", text:"Admin returned control to steward for rework.", time:"Just now"}]};
    setControls(updated);
  };

  const uploadEvidence = () => {
    const updated = [...controls];
    updated[ctrlIdx] = {...updated[ctrlIdx], evidence:[...updated[ctrlIdx].evidence, "Evidence_"+Date.now().toString(36)+".pdf"], auditLog:[...updated[ctrlIdx].auditLog, {action:"Evidence uploaded by "+senderName, time:"Just now"}]};
    setControls(updated);
  };

  const canSubmit = !isAdmin && ctrl.workflow === "Open";
  const canClose = isAdmin && ctrl.workflow === "Ready for Review";
  const canReopen = isAdmin && ctrl.workflow === "Ready for Review";

  return (
    <div>
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"#6b7280",fontSize:13,fontWeight:600,marginBottom:20,padding:0}}><ArrowLeft size={16}/> {t("back",lang||"en")}</button>

      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        <StatusBadge status={ctrl.status} lang={lang||"en"}/>
        <WorkflowBadge wf={ctrl.workflow} lang={lang||"en"}/>
        {ctrl.workflow==="Ready for Review" && ctrl.proposedStatus && <div style={{fontSize:11,color:"#6366f1",fontWeight:600,background:"#eef2ff",padding:"3px 8px",borderRadius:6}}>Proposed: {ctrl.proposedStatus}</div>}
        <div style={{flex:1}}>
          <h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#111827"}}>{ctrl.cid}: {ctrl.cn}</h2>
          <p style={{margin:0,color:"#6b7280",fontSize:13}}>
            <span style={{color:"#6366f1",fontWeight:600}}>{ctrl.domainName}</span> ·
            <span style={{padding:"1px 6px",marginLeft:4,borderRadius:4,fontSize:10,fontWeight:700,background:ctrl.priority==="P1"?"#fef2f2":ctrl.priority==="P2"?"#fffbeb":"#f0fdf4",color:ctrl.priority==="P1"?"#dc2626":ctrl.priority==="P2"?"#d97706":"#059669"}}>{ctrl.priority}</span>
            <span style={{marginLeft:8,color:"#9ca3af"}}>{t("assigned",lang||"en")}: {ctrl.assignedDate}</span>
          </p>
        </div>
      </div>

      {/* Steward submit panel */}
      {canSubmit && (
        <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:12,padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:200}}>
            <div style={{fontSize:12,fontWeight:700,color:"#92400e",marginBottom:6}}>{t("submitForReview",lang||"en")}</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:12,color:"#6b7280"}}>{t("proposedStatus",lang||"en")}</span>
              <select value={selectedStatus} onChange={e=>setSelectedStatus(e.target.value)} style={{padding:"6px 10px",borderRadius:8,border:"1px solid #e5e7eb",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                {COMPLIANCE_OPTS.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <button onClick={submitForReview} style={{padding:"10px 24px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#059669,#34d399)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>{t("submitForReviewBtn",lang||"en")}</button>
        </div>
      )}

      {/* Admin close panel */}
      {canClose && (
        <div style={{background:"#eef2ff",border:"1px solid #c7d2fe",borderRadius:12,padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:200}}>
            <div style={{fontSize:12,fontWeight:700,color:"#4338ca",marginBottom:6}}>{t("reviewAndClose",lang||"en")}</div>
            <div style={{fontSize:12,color:"#6b7280",marginBottom:6}}>{t("stewardProposed",lang||"en")} <strong style={{color:STATUS_COLORS[ctrl.proposedStatus]}}>{ctrl.proposedStatus}</strong></div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:12,color:"#6b7280"}}>{t("finalStatus",lang||"en")}</span>
              <select value={adminCloseStatus} onChange={e=>setAdminCloseStatus(e.target.value)} style={{padding:"6px 10px",borderRadius:8,border:"1px solid #e5e7eb",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                {COMPLIANCE_OPTS.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={closeControl} style={{padding:"10px 20px",borderRadius:10,border:"none",background:"#059669",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>{t("closeControl",lang||"en")}</button>
            <button onClick={reopenControl} style={{padding:"10px 20px",borderRadius:10,border:"1px solid #d97706",background:"#fff",color:"#d97706",fontSize:13,fontWeight:700,cursor:"pointer"}}>{t("reopen",lang||"en")}</button>
          </div>
        </div>
      )}

      {ctrl.controlDesc && (
        <div style={{background:"#f8fafc",borderRadius:12,padding:"14px 18px",marginBottom:20,border:"1px solid #e5e7eb"}}>
          <div style={{fontSize:11,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>{t("controlDescription",lang||"en")}</div>
          <div style={{fontSize:13,color:"#374151",lineHeight:1.6}}>{ctrl.controlDesc}</div>
        </div>
      )}

      <div style={{display:"flex",gap:4,marginBottom:20}}>
        {[{k:"comments",l:t("comments",lang||"en"),count:ctrl.comments.length},{k:"audit",l:t("auditLog",lang||"en"),count:ctrl.auditLog.length},{k:"evidence",l:t("evidence",lang||"en"),count:ctrl.evidence.length}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} style={{padding:"8px 16px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:tab===t.k?"#111827":"#f3f4f6",color:tab===t.k?"#fff":"#6b7280"}}>
            {t.l} <span style={{marginLeft:4,padding:"1px 6px",borderRadius:10,fontSize:10,fontWeight:700,background:tab===t.k?"rgba(255,255,255,0.2)":"#e5e7eb"}}>{t.count}</span>
          </button>
        ))}
      </div>

      <div style={{background:"#fff",borderRadius:16,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0"}}>
        {tab==="comments" && (
          <div>
            <div style={{maxHeight:360,overflow:"auto",marginBottom:16}}>
              {ctrl.comments.length===0 && <p style={{color:"#9ca3af",fontSize:13,textAlign:"left",padding:20}}>{t("noCommentsYet",lang||"en")}</p>}
              {ctrl.comments.map((c,i)=>(
                <div key={i} style={{display:"flex",gap:10,marginBottom:12,flexDirection:c.from===senderName?"row-reverse":"row"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:c.from==="Admin"?"#6366f1":c.from==="System"?"#9ca3af":"#059669",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:700,flexShrink:0}}>{c.from==="System"?"S":c.from[0]}</div>
                  <div style={{maxWidth:"70%",padding:"10px 14px",borderRadius:12,background:c.from===senderName?(isAdmin?"#eef2ff":"#ecfdf5"):c.from==="System"?"#f3f4f6":isAdmin?"#ecfdf5":"#eef2ff"}}>
                    <div style={{fontSize:11,fontWeight:600,color:c.from==="Admin"?"#6366f1":c.from==="System"?"#6b7280":"#059669",marginBottom:4}}>{c.from}</div>
                    <div style={{fontSize:13,color:"#374151",lineHeight:1.5}}>{c.text}</div>
                    <div style={{fontSize:10,color:"#9ca3af",marginTop:4}}>{c.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder={t("typeMessage",lang||"en")} onKeyDown={e=>{if(e.key==="Enter")addComment();}} style={{flex:1,padding:"10px 14px",borderRadius:10,border:"1px solid #e5e7eb",fontSize:13,outline:"none"}}/>
              <button onClick={addComment} style={{padding:"10px 20px",borderRadius:10,border:"none",background:isAdmin?"#6366f1":"#059669",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}><Send size={14}/></button>
            </div>
          </div>
        )}
        {tab==="audit" && (<div>{ctrl.auditLog.map((a,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<ctrl.auditLog.length-1?"1px solid #f9fafb":"none"}}><div style={{width:8,height:8,borderRadius:"50%",background:"#6366f1",flexShrink:0}}/><div style={{flex:1,fontSize:13,color:"#374151"}}>{a.action}</div><span style={{fontSize:11,color:"#9ca3af",whiteSpace:"nowrap"}}>{a.time}</span></div>))}</div>)}
        {tab==="evidence" && (
          <div>
            {ctrl.evidence.length===0 && <p style={{color:"#9ca3af",fontSize:13,textAlign:"left",padding:20}}>{t("noEvidenceYet",lang||"en")}</p>}
            {ctrl.evidence.map((f,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,background:"#f9fafb",marginBottom:8}}><FileText size={16} color="#6366f1"/><span style={{fontSize:13,color:"#374151",fontWeight:500,flex:1}}>{f}</span><span style={{fontSize:11,color:"#9ca3af"}}>{t("uploaded",lang||"en")}</span></div>))}
            {!isAdmin && ctrl.workflow==="Open" && <button onClick={uploadEvidence} style={{display:"flex",alignItems:"center",gap:6,marginTop:12,padding:"10px 16px",borderRadius:10,border:"2px dashed #d1d5db",background:"#fff",color:"#6b7280",fontSize:13,fontWeight:600,cursor:"pointer",width:"100%",justifyContent:"center"}}>{t("uploadEvidence",lang||"en")}</button>}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══ GAUGE + KPIs ═══
function GaugeDial({ value, label, subtitle }) {
  const w = 160, h = 100;
  const cx = w / 2, cy = 88;
  const r = 70;
  const strokeW = 14;
  const clamp = Math.max(0, Math.min(100, value));
  const toRad = d => (d * Math.PI) / 180;
  // Arc spans from 180° (left) to 0° (right) — a semicircle
  const arcX = (a) => cx + r * Math.cos(toRad(a));
  const arcY = (a) => cy - r * Math.sin(toRad(a));
  // Needle angle: 180° = 0%, 0° = 100%
  const needleAngle = 180 - (clamp / 100) * 180;
  const needleLen = r - 20;
  const nx = cx + needleLen * Math.cos(toRad(needleAngle));
  const ny = cy - needleLen * Math.sin(toRad(needleAngle));
  const color = gc(value);

  // Build gradient segments: green (left) → yellow (center) → red (right)
  const segments = 40;
  const segArcs = [];
  for (let i = 0; i < segments; i++) {
    const a1 = 180 - (i / segments) * 180;
    const a2 = 180 - ((i + 1) / segments) * 180;
    const pct = i / segments; // 0=left(good) to 1=right(bad)
    let sr, sg, sb;
    if (pct < 0.45) {
      const t = pct / 0.45;
      sr = Math.round(76 + t * (210 - 76));
      sg = Math.round(175 + t * (170 - 175));
      sb = Math.round(80 + t * (0 - 80));
    } else if (pct < 0.65) {
      const t = (pct - 0.45) / 0.2;
      sr = Math.round(210 + t * (234 - 210));
      sg = Math.round(170 + t * (130 - 170));
      sb = Math.round(0 + t * (0 - 0));
    } else {
      const t = (pct - 0.65) / 0.35;
      sr = Math.round(234 - t * (30));
      sg = Math.round(130 - t * (100));
      sb = Math.round(0 + t * (20));
    }
    const sc = `rgb(${sr},${sg},${sb})`;
    const x1 = arcX(a1), y1 = arcY(a1);
    const x2 = arcX(a2), y2 = arcY(a2);
    segArcs.push(<path key={i} d={`M ${x1} ${y1} A ${r} ${r} 0 0 0 ${x2} ${y2}`} fill="none" stroke={sc} strokeWidth={strokeW} />);
  }

  return (
    <div style={{textAlign:"center",flex:1,minWidth:0,maxWidth:180}}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display:"block",margin:"0 auto"}}>
        {/* Gradient arc track */}
        {segArcs}
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map(tick => {
          const ta = 180 - (tick / 100) * 180;
          const ix = cx + (r + 8) * Math.cos(toRad(ta));
          const iy = cy - (r + 8) * Math.sin(toRad(ta));
          const ox = cx + (r - 8) * Math.cos(toRad(ta));
          const oy = cy - (r - 8) * Math.sin(toRad(ta));
          return <line key={tick} x1={ox} y1={oy} x2={ix} y2={iy} stroke="#fff" strokeWidth={2} />;
        })}
        {/* Needle */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#374151" strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={5} fill="#374151" />
        <circle cx={cx} cy={cy} r={2.5} fill="#fff" />
        {/* Center value */}
        <text x={cx} y={cy - 18} textAnchor="middle" fontSize="26" fontWeight="800" fill={color} fontFamily="'DM Sans',sans-serif">{value}%</text>
      </svg>
      <div style={{fontSize:12,fontWeight:700,color:"#374151",marginTop:6,lineHeight:1.3}}>{label}</div>
      <div style={{fontSize:10,color:"#9ca3af",marginTop:2,lineHeight:1.3}}>{subtitle}</div>
    </div>
  );
}


function getDomainKPIs(domainId, compliance) {
  // Seed variation from compliance to create realistic related values
  const v = (base, offset) => Math.max(0, Math.min(100, Math.round(base + offset)));

  const kpiMap = {
    DG: [
      { label:"Strategy Maturity", subtitle:"DM & PDP strategy completeness", value: v(compliance, 3) },
      { label:"Roles Fulfillment", subtitle:"% of governance roles appointed", value: v(compliance, 8) },
      { label:"Policy Gap Closure", subtitle:"% of policy gaps addressed", value: v(compliance, -5) },
    ],
    MCM: [
      { label:"Sources Cataloged", subtitle:"% of priority data sources in catalog", value: v(compliance, -4) },
      { label:"Metadata Completeness", subtitle:"% of required fields populated", value: v(compliance, 2) },
      { label:"Metadata Quality", subtitle:"Accuracy & consistency score", value: v(compliance, -8) },
    ],
    DQ: [
      { label:"Priority Data Identified", subtitle:"% of critical assets prioritized", value: v(compliance, 6) },
      { label:"Initial Assessment", subtitle:"% of priority data quality-assessed", value: v(compliance, -3) },
      { label:"DQ Plan Milestones", subtitle:"% of planned milestones achieved", value: v(compliance, -10) },
    ],
    DO: [
      { label:"Systems Prioritized", subtitle:"% of systems ranked for DR", value: v(compliance, 5) },
      { label:"Retention Policy", subtitle:"% of data under retention policy", value: v(compliance, -6) },
      { label:"DR Plan Readiness", subtitle:"Disaster recovery completeness", value: v(compliance, -2) },
    ],
    DCM: [
      { label:"Documents Digitized", subtitle:"% of paper docs migrated to DMS", value: v(compliance, -8) },
      { label:"DMS Adoption", subtitle:"% of target documents in DMS", value: v(compliance, 4) },
      { label:"Workflow Automation", subtitle:"% of key processes as workflows", value: v(compliance, -12) },
    ],
    DAM: [
      { label:"Architecture Documented", subtitle:"% of current state documented", value: v(compliance, 4) },
      { label:"Data Model Coverage", subtitle:"% of entities modeled (C/L/P)", value: v(compliance, -3) },
      { label:"EA Framework Adoption", subtitle:"TOGAF/Zachmann maturity", value: v(compliance, -7) },
    ],
    DSI: [
      { label:"Pain Points Resolved", subtitle:"% of integration issues fixed", value: v(compliance, -5) },
      { label:"Sharing SLA Compliance", subtitle:"% of requests within SLA", value: v(compliance, 6) },
      { label:"Agreements Current", subtitle:"% of sharing agreements reviewed", value: v(compliance, -2) },
    ],
    RMD: [
      { label:"RMD Objects Identified", subtitle:"% of master/ref data inventoried", value: v(compliance, 3) },
      { label:"Golden Record Coverage", subtitle:"% of master data with golden records", value: v(compliance, -10) },
      { label:"Stewardship Assigned", subtitle:"% of RMD objects with stewards", value: v(compliance, 5) },
    ],
    BIA: [
      { label:"Use Cases Deployed", subtitle:"% of shortlisted cases in production", value: v(compliance, -6) },
      { label:"Analytics ROI Realized", subtitle:"% of projected ROI achieved", value: v(compliance, -12) },
      { label:"Pipeline Health", subtitle:"Detailed vs identified use cases", value: v(compliance, 4) },
    ],
    DVR: [
      { label:"Use Cases Identified", subtitle:"Revenue & savings cases documented", value: v(compliance, 8) },
      { label:"Revenue Pipeline", subtitle:"% of projected revenue realized", value: v(compliance, -15) },
      { label:"Cost Savings Achieved", subtitle:"% of targeted savings realized", value: v(compliance, -8) },
    ],
    OD: [
      { label:"Datasets Published", subtitle:"% of public datasets on portal", value: v(compliance, -4) },
      { label:"Format Compliance", subtitle:"% in CSV/JSON/XML/RDF formats", value: v(compliance, 6) },
      { label:"Dataset Freshness", subtitle:"% of datasets updated on schedule", value: v(compliance, -7) },
    ],
    FOI: [
      { label:"Request SLA Met", subtitle:"% of FOI requests answered on time", value: v(compliance, 3) },
      { label:"Public Info Published", subtitle:"% of required info on website", value: v(compliance, -5) },
      { label:"Process Compliance", subtitle:"% of requests following standard process", value: v(compliance, 7) },
    ],
    DC: [
      { label:"Datasets Classified", subtitle:"% of inventoried data classified", value: v(compliance, 2) },
      { label:"Impact Assessment", subtitle:"% of datasets impact-assessed", value: v(compliance, -3) },
      { label:"Public Data Maximized", subtitle:"% of low-impact classified as public", value: v(compliance, -8) },
    ],
    PDP: [
      { label:"Training Completion", subtitle:"% of employees PDP-trained", value: v(compliance, 5) },
      { label:"Breach Readiness", subtitle:"Breach notification process maturity", value: v(compliance, -6) },
      { label:"Privacy Assessment", subtitle:"% of systems privacy-assessed", value: v(compliance, -3) },
    ],
    DS: [
      { label:"NCA Compliance", subtitle:"Overall NCA assessment score", value: v(compliance, -2) },
      { label:"Security Controls", subtitle:"% of required controls deployed", value: v(compliance, 4) },
      { label:"Incident Response", subtitle:"Security incident process maturity", value: v(compliance, -8) },
    ],
  };
  return kpiMap[domainId] || [
    { label:"Compliance Score", subtitle:"Overall domain score", value: compliance },
    { label:"Control Coverage", subtitle:"% of controls assessed", value: v(compliance, -5) },
    { label:"Evidence Collected", subtitle:"% of evidence documented", value: v(compliance, -10) },
  ];
}


// ═══ BU Selector ═══
function BUSelector({selected,onChange,lang}) {
  const [open,setOpen] = useState(false);
  const cur = BUS.find(b=>b.id===selected);
  return (
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:12,color:"#6b7280",fontWeight:600,whiteSpace:"nowrap"}}>{t("businessUnit",lang||"en")}</span>
      <div style={{position:"relative"}}>
        <button onClick={()=>setOpen(!open)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",borderRadius:12,border:"1px solid #e5e7eb",background:"#fff",cursor:"pointer",minWidth:240,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
          <Building2 size={15} color="#6366f1"/><span style={{fontSize:13,fontWeight:600,color:"#374151",flex:1,textAlign:"left"}}>{cur?.icon} {cur?.name}</span><ChevronDown size={14} color="#9ca3af" style={{transform:open?"rotate(180deg)":"none",transition:"transform 0.2s"}}/>
        </button>
        {open && <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#fff",borderRadius:12,border:"1px solid #e5e7eb",boxShadow:"0 8px 24px rgba(0,0,0,0.12)",zIndex:50,overflow:"hidden",maxHeight:320,overflowY:"auto"}}>
          {BUS.map(bu=>(<button key={bu.id} onClick={()=>{onChange(bu.id);setOpen(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",width:"100%",border:"none",background:bu.id===selected?"#f0fdf4":"#fff",cursor:"pointer",textAlign:"left",borderBottom:"1px solid #f9fafb"}} onMouseEnter={e=>{if(bu.id!==selected)e.currentTarget.style.background="#f9fafb"}} onMouseLeave={e=>{if(bu.id!==selected)e.currentTarget.style.background="#fff"}}><span style={{fontSize:15}}>{bu.icon}</span><span style={{fontSize:13,fontWeight:bu.id===selected?700:500,color:"#374151"}}>{bu.name}</span>{bu.id===selected&&<CheckCircle size={14} color="#059669" style={{marginLeft:"auto"}}/>}</button>))}
        </div>}
      </div>
    </div>
  );
}

// ═══ Radar Tooltip ═══
function RadarTooltipContent({active,payload}) {
  if (!active||!payload?.length) return null;
  const d=payload[0]?.payload; if(!d) return null;
  return (<div style={{background:"#1e293b",color:"#f1f5f9",padding:"10px 14px",borderRadius:10,fontSize:12,boxShadow:"0 4px 12px rgba(0,0,0,0.3)",maxWidth:220}}>
    <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>{d.fullName}</div>
    <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:20,fontWeight:800,color:gc(d.compliance)}}>{d.compliance}%</span><span style={{padding:"2px 6px",borderRadius:4,fontSize:10,fontWeight:700,background:gc(d.compliance)+"22",color:gc(d.compliance)}}>{gl(d.compliance)}</span></div>
  </div>);
}
function RadarDot(props) {
  const {cx,cy,payload,onDotClick}=props;
  if(!cx||!cy) return null;
  return (
    <circle
      cx={cx} cy={cy} r={8}
      fill="#059669" stroke="#fff" strokeWidth={2}
      style={{cursor:"pointer"}}
      onClick={()=>{ if(onDotClick && payload) onDotClick(payload); }}
    />
  );
}

// ═══ DOMAIN DETAIL (Admin drill-down) ═══
function DomainDetail({domain, buName, controls, setControls, onBack, onOpenControl, lang}) {
  const rawSpecs = getSpecsForDomain(domain.id);
  const specs = useMemo(() => assignStatuses(rawSpecs, domain.compliance), [domain.id, domain.compliance]);
  const [editingIdx, setEditingIdx] = useState(null);
  const [editText, setEditText] = useState("");
  const [customDescs, setCustomDescs] = useState({});

  const getDesc = (sid, original) => customDescs[sid] || original;
  const startEdit = (idx, sid, desc) => { setEditingIdx(idx); setEditText(getDesc(sid, desc)); };
  const saveEdit = (sid) => { setCustomDescs(p => ({...p, [sid]: editText})); setEditingIdx(null); };

  const domainControls = controls.filter(c => c.domain === domain.id);

  const priorities = ["P1","P2","P3","As specified by NCA"];
  const breakdownData = priorities.map(p => {
    const ps = specs.filter(s => s.p === p);
    if (ps.length === 0) return null;
    return { priority:p, total:ps.length, Compliant:ps.filter(s=>s.status==="Compliant").length, "Partially Compliant":ps.filter(s=>s.status==="Partially Compliant").length, "Non-Compliant":ps.filter(s=>s.status==="Non-Compliant").length, "Not Applicable":ps.filter(s=>s.status==="Not Applicable").length };
  }).filter(Boolean);

  const statusColors2 = {"Compliant":"#059669","Partially Compliant":"#d97706","Non-Compliant":"#dc2626","Not Applicable":"#94a3b8"};

  return (
    <div>
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"#6b7280",fontSize:13,fontWeight:600,marginBottom:20,padding:0}}><ArrowLeft size={16}/> {t("backToDashboard",lang||"en")}</button>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24,flexWrap:"wrap"}}>
        <div style={{background:gbg(domain.compliance),borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:32,fontWeight:800,color:gc(domain.compliance),fontFamily:"'DM Sans',sans-serif"}}>{domain.compliance}%</span><Badge value={domain.compliance}/>
        </div>
        <div><h2 style={{margin:0,fontSize:22,fontWeight:800,color:"#111827"}}>{domain.id}: {domain.name}</h2><p style={{margin:0,color:"#6b7280",fontSize:13}}><span style={{color:"#6366f1",fontWeight:600}}>{buName}</span> · {domain.controls} Controls · {domain.specs} Specs</p></div>
      </div>

      <div style={{display:"flex",gap:20,marginBottom:24}}>
        {/* Priority Breakdown */}
        <div style={{flex:1,background:"#fff",borderRadius:16,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0"}}>
          <h4 style={{margin:"0 0 20px",fontSize:13,color:"#6b7280",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>{t("complianceByPriority",lang||"en")}</h4>
          {breakdownData.map(row => (
            <div key={row.priority} style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:13,fontWeight:700,color:row.priority==="P1"?"#dc2626":row.priority==="P2"?"#d97706":row.priority==="P3"?"#059669":"#6366f1"}}>{row.priority}</span>
                <span style={{fontSize:11,color:"#9ca3af"}}>{row.total} specifications</span>
              </div>
              <div style={{display:"flex",borderRadius:6,overflow:"hidden",height:24,background:"#f3f4f6"}}>
                {["Compliant","Partially Compliant","Non-Compliant","Not Applicable"].map(st => { const w=row.total>0?(row[st]/row.total)*100:0; if(w===0) return null; return <div key={st} title={`${st}: ${row[st]}`} style={{width:`${w}%`,background:statusColors2[st]}}/>; })}
              </div>
              <div style={{display:"flex",gap:12,marginTop:6}}>
                {["Compliant","Partially Compliant","Non-Compliant","Not Applicable"].map(st => (row[st]>0 && <span key={st} style={{fontSize:10,color:statusColors2[st],fontWeight:600}}>{row[st]} {st==="Partially Compliant"?"Partial":st==="Non-Compliant"?"Non-Compl.":st}</span>))}
              </div>
            </div>
          ))}
        </div>

        {/* KPI Gauges */}
        <div style={{flex:1,background:"#fff",borderRadius:16,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0"}}>
          <h4 style={{margin:"0 0 20px",fontSize:13,color:"#6b7280",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>{t("p1ControlKPIs",lang||"en")}</h4>
          <div style={{display:"flex",gap:16,justifyContent:"space-around"}}>
            {getDomainKPIs(domain.id, domain.compliance).map((kpi,ki) => (<GaugeDial key={ki} value={kpi.value} label={kpi.label} subtitle={kpi.subtitle}/>))}
          </div>
        </div>
      </div>

      {/* Assigned Controls Review */}
      {domainControls.length > 0 && (
        <div style={{background:"#fff",borderRadius:16,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0",marginBottom:24}}>
          <h4 style={{margin:"0 0 16px",fontSize:13,color:"#6b7280",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>Assigned Controls — Review Status ({domainControls.length})</h4>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{borderBottom:"2px solid #f3f4f6"}}>
              {[t("control",lang||"en"),t("steward",lang||"en"),t("priority",lang||"en"),t("compliance",lang||"en"),t("workflow",lang||"en"),t("proposed",lang||"en"),t("comments",lang||"en"),t("evidence",lang||"en"),""].map(h=>(<th key={h} style={{textAlign:"left",padding:"8px 10px",color:"#6b7280",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>{h}</th>))}
            </tr></thead>
            <tbody>
              {domainControls.map((c) => {
                const idx = controls.findIndex(x=>x.cid===c.cid);
                // workflow status from control
                return (
                  <tr key={c.cid} style={{borderBottom:"1px solid #f9fafb",cursor:"pointer"}} onClick={()=>onOpenControl(idx)}
                    onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"10px"}}><div style={{fontWeight:700,color:"#374151"}}>{c.cid}</div><div style={{fontSize:11,color:"#6b7280"}}>{c.cn}</div></td>
                    <td style={{padding:"10px",fontSize:12,color:"#6b7280"}}>{c.steward}</td>
                    <td style={{padding:"10px"}}><span style={{padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700,background:c.priority==="P1"?"#fef2f2":c.priority==="P2"?"#fffbeb":"#f0fdf4",color:c.priority==="P1"?"#dc2626":c.priority==="P2"?"#d97706":"#059669"}}>{c.priority}</span></td>
                    <td style={{padding:"10px"}}><StatusBadge status={c.status} lang={lang||"en"}/></td>
                    <td style={{padding:"10px"}}><WorkflowBadge wf={c.workflow} lang={lang||"en"}/></td>
                    <td style={{padding:"10px",fontSize:11,color:c.proposedStatus?STATUS_COLORS[c.proposedStatus]:"#9ca3af"}}>{c.proposedStatus||"—"}</td>
                    <td style={{padding:"10px",fontSize:12,color:"#6b7280"}}><MessageSquare size={12} style={{marginRight:4}}/>{c.comments.length}</td>
                    <td style={{padding:"10px",fontSize:12,color:"#6b7280"}}><FileText size={12} style={{marginRight:4}}/>{c.evidence.length}</td>
                    <td style={{padding:"10px"}}><ChevronRight size={14} color="#9ca3af"/></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Spec Table */}
      <div style={{background:"#fff",borderRadius:16,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0"}}>
        <h4 style={{margin:"0 0 16px",fontSize:13,color:"#6b7280",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>{t("specificationDetails",lang||"en")} ({specs.length})</h4>
        <div style={{maxHeight:500,overflow:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{borderBottom:"2px solid #f3f4f6",position:"sticky",top:0,background:"#fff",zIndex:2}}>
              {["Spec ID",t("specNameAndDesc",lang||"en"),t("control",lang||"en"),t("priority",lang||"en"),t("status",lang||"en"),""].map(h=>(<th key={h} style={{textAlign:"left",padding:"8px 10px",color:"#6b7280",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>{h}</th>))}
            </tr></thead>
            <tbody>
              {specs.map((s,i) => (
                <tr key={i} style={{borderBottom:"1px solid #f9fafb",verticalAlign:"top"}}>
                  <td style={{padding:"10px",fontWeight:600,color:"#374151",whiteSpace:"nowrap",width:80}}>{s.sid}</td>
                  <td style={{padding:"10px",maxWidth:400}}>
                    <div style={{fontWeight:600,color:"#374151",marginBottom:4}}>{s.sn}</div>
                    {editingIdx===i ? (
                      <div><textarea value={editText} onChange={e=>setEditText(e.target.value)} style={{width:"100%",minHeight:60,padding:8,borderRadius:8,border:"1px solid #6366f1",fontSize:12,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
                        <div style={{display:"flex",gap:6,marginTop:4}}>
                          <button onClick={()=>saveEdit(s.sid)} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:6,border:"none",background:"#059669",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer"}}><Save size={12}/> Save</button>
                          <button onClick={()=>setEditingIdx(null)} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:6,border:"1px solid #e5e7eb",background:"#fff",color:"#6b7280",fontSize:11,cursor:"pointer"}}><X size={12}/> Cancel</button>
                        </div></div>
                    ) : <div style={{color:"#6b7280",fontSize:11,lineHeight:1.5}}>{getDesc(s.sid, s.sd)}</div>}
                  </td>
                  <td style={{padding:"10px",color:"#6b7280",whiteSpace:"nowrap"}}>{s.cid}<br/><span style={{fontSize:10,color:"#9ca3af"}}>{s.cn}</span></td>
                  <td style={{padding:"10px"}}><span style={{padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700,background:s.p==="P1"?"#fef2f2":s.p==="P2"?"#fffbeb":s.p==="P3"?"#f0fdf4":"#eef2ff",color:s.p==="P1"?"#dc2626":s.p==="P2"?"#d97706":s.p==="P3"?"#059669":"#6366f1"}}>{s.p}</span></td>
                  <td style={{padding:"10px"}}><div style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:6,background:s.status==="Not Applicable"?"#f3f4f6":gbg(s.status==="Compliant"?80:s.status==="Partially Compliant"?55:30),width:"fit-content"}}><StatusIcon status={s.status}/><span style={{fontSize:11,fontWeight:600}}>{s.status}</span></div></td>
                  <td style={{padding:"10px 6px"}}>{editingIdx!==i&&<button onClick={()=>startEdit(i,s.sid,s.sd)} style={{background:"none",border:"none",cursor:"pointer",color:"#9ca3af",padding:4,borderRadius:4}} onMouseEnter={e=>e.currentTarget.style.color="#6366f1"} onMouseLeave={e=>e.currentTarget.style.color="#9ca3af"}><Edit3 size={14}/></button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══ LOGIN PAGE ═══
function LoginPage({onLogin, lang, setLang}) {
  const [role,setRole]=useState(null); const [hov,setHov]=useState(null);
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%)",fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,opacity:0.04,backgroundImage:"radial-gradient(circle at 1px 1px,white 1px,transparent 0)",backgroundSize:"40px 40px"}}/>
      <div style={{textAlign:"center",zIndex:1,width:"100%",maxWidth:520,padding:"0 20px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:8}}><Shield size={36} color="#34d399" strokeWidth={2.5}/><span style={{fontSize:28,fontWeight:800,color:"#f1f5f9",letterSpacing:"-0.02em"}}>{t('ndmoCompliancePortal',lang)}</span></div>
        <p style={{color:"#94a3b8",fontSize:14,marginBottom:40}}>{t('ndmoSubtitle',lang)}</p>
        <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",borderRadius:24,padding:"40px 36px",border:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><LangToggle lang={lang} setLang={setLang}/></div><p style={{color:"#cbd5e1",fontSize:14,marginBottom:24,fontWeight:500}}>{t('selectRole',lang)}</p>
          <div style={{display:"flex",gap:16,marginBottom:28}}>
            {[{key:"admin",label:t("dmoAdmin",lang),desc:t("dmoAdminDesc",lang),icon:<Users size={24}/>},{key:"steward",label:t("dataSteward",lang),desc:t("dataStewardDesc",lang),icon:<Eye size={24}/>}].map(r=>(
              <button key={r.key} onClick={()=>setRole(r.key)} onMouseEnter={()=>setHov(r.key)} onMouseLeave={()=>setHov(null)} style={{flex:1,padding:"24px 16px",borderRadius:16,cursor:"pointer",transition:"all 0.25s",background:role===r.key?"rgba(52,211,153,0.12)":hov===r.key?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.03)",border:role===r.key?"2px solid #34d399":"2px solid rgba(255,255,255,0.08)",color:role===r.key?"#34d399":"#94a3b8",transform:hov===r.key?"translateY(-2px)":"none"}}>
                <div style={{marginBottom:12}}>{r.icon}</div><div style={{fontSize:16,fontWeight:700,marginBottom:4,color:role===r.key?"#f1f5f9":"#e2e8f0"}}>{r.label}</div><div style={{fontSize:12,opacity:0.7}}>{r.desc}</div>
              </button>))}
          </div>
          <button onClick={()=>role&&onLogin(role)} disabled={!role} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",cursor:role?"pointer":"not-allowed",background:role?"linear-gradient(135deg,#059669,#34d399)":"#1e293b",color:role?"#fff":"#475569",fontSize:15,fontWeight:700,opacity:role?1:0.5,boxShadow:role?"0 4px 20px rgba(52,211,153,0.3)":"none"}}>{t('signIn',lang)}</button>
        </div>
        <p style={{color:"#475569",fontSize:11,marginTop:24}}>{t('prototypeFooter',lang)}</p>
      </div>
    </div>
  );
}

// ═══ TOP NAV SECTIONS ═══
const NAV_SECTIONS = [
  {key:"userGuide",tKey:"userGuide",type:"page",icon:"📖",adminOnly:false},
  {key:"aiEvidence",tKey:"aiEvidenceValidation",type:"restricted",icon:"🔬",adminOnly:false},
  {key:"aiAdvisor",tKey:"aiComplianceAdvisor",type:"restricted",icon:"🧠",adminOnly:false},
  {key:"aiRisk",tKey:"aiRiskScoring",type:"restricted",icon:"📊",adminOnly:true},
  {key:"reports",tKey:"reportsAnalytics",type:"comingSoon",icon:"📈",adminOnly:false},
  {key:"about",tKey:"aboutPortal",type:"page",icon:"ℹ️",adminOnly:false},
];

function SideNav({lang, onNav, currentNav, isOpen, onClose, role}) {
  const filtered = NAV_SECTIONS.filter(s => !s.adminOnly || role === "admin");
  return (
    <>
      {/* Overlay */}
      {isOpen && <div onClick={onClose} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.3)",zIndex:998,transition:"opacity 0.25s"}}/>}
      {/* Sidebar */}
      <div style={{position:"fixed",top:0,left:isOpen?0:-320,width:300,height:"100vh",background:"#fff",
        boxShadow:isOpen?"4px 0 24px rgba(0,0,0,0.12)":"none",zIndex:999,transition:"left 0.3s ease",
        display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Header */}
        <div style={{padding:"20px 20px 16px",borderBottom:"1px solid #f0f0f0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Shield size={18} color="#059669" strokeWidth={2.5}/>
            <span style={{fontSize:14,fontWeight:800,color:"#111827"}}>{t("ndmoPortal",lang)}</span>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280",padding:4}}>
            <X size={18}/>
          </button>
        </div>
        {/* Nav Items */}
        <div style={{flex:1,overflow:"auto",padding:"12px 12px"}}>
          {filtered.map(s => {
            const isActive = currentNav === s.key;
            const typeBadge = s.type === "restricted" ? t("restricted",lang) : s.type === "comingSoon" ? t("comingSoon",lang) : null;
            return (
              <button key={s.key} onClick={() => { onNav(s.key); onClose(); }}
                style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"12px 14px",borderRadius:10,
                  border:"none",cursor:"pointer",textAlign:"left",marginBottom:4,transition:"all 0.15s",
                  background:isActive?"#f3f4f6":"transparent",color:"#111827"}}
                onMouseEnter={e=>{if(!isActive)e.currentTarget.style.background="#f9fafb"}}
                onMouseLeave={e=>{if(!isActive)e.currentTarget.style.background=isActive?"#f3f4f6":"transparent"}}>
                <span style={{fontSize:18,lineHeight:1}}>{s.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:isActive?800:500,color:"#111827"}}>{t(s.tKey,lang)}</div>
                </div>
                {typeBadge && (
                  <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,letterSpacing:"0.03em",
                    background:s.type==="restricted"?"#f3f4f6":"#f3f4f6",
                    color:"#6b7280"}}>{typeBadge}</span>
                )}
              </button>
            );
          })}
        </div>
        {/* Footer */}
        <div style={{padding:"16px 20px",borderTop:"1px solid #f0f0f0",fontSize:10,color:"#9ca3af"}}>
          <div>NDMO Compliance Portal · v1.0</div>
          <div style={{marginTop:2,color:"#c4c9d1"}}>© 2026 Mohammed Adnan</div>
        </div>
      </div>
    </>
  );
}

function MenuButton({lang, onClick}) {
  return (
    <button onClick={onClick} style={{display:"flex",alignItems:"center",justifyContent:"center",padding:6,borderRadius:8,
      border:"none",background:"transparent",cursor:"pointer",color:"#374151",
      transition:"all 0.15s"}}
      onMouseEnter={e=>e.currentTarget.style.background="#f3f4f6"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <MenuIcon size={20}/>
    </button>
  );
}

// ═══ APP FOOTER ═══
function AppFooter() {
  return (
    <div style={{borderTop:"1px solid #f0f0f0",background:"#fff",padding:"10px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:11,color:"#9ca3af"}}>
      <span>NDMO Compliance Portal · v1.0 · Prototype</span>
      <span>Developed by <strong style={{color:"#6b7280",fontWeight:600}}>Mohammed Adnan</strong> · © 2026</span>
    </div>
  );
}

function RestrictedPage({section, lang, onBack}) {
  const configs = {
    aiEvidence: {title:"aiEvTitle",desc:"aiEvDesc",what:"aiEvWhat",why:"aiEvWhy",icon:"🔬",color:"#6366f1"},
    aiAdvisor: {title:"aiCaTitle",desc:"aiCaDesc",what:"aiCaWhat",why:"aiCaWhy",icon:"🧠",color:"#8b5cf6"},
    aiRisk: {title:"aiRsTitle",desc:"aiRsDesc",what:"aiRsWhat",why:"aiRsWhy",icon:"📊",color:"#7c3aed"},
  };
  const cfg = configs[section];
  if (!cfg) return null;
  return (
    <div style={{maxWidth:700,margin:"0 auto",padding:"40px 20px"}}>
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"#6b7280",fontSize:13,fontWeight:600,marginBottom:24,padding:0}}><ArrowLeft size={16}/> {t("backToDashboardNav",lang)}</button>
      <div style={{textAlign:"left",marginBottom:32}}>
        <span style={{fontSize:48}}>{cfg.icon}</span>
        <h1 style={{margin:"12px 0 8px",fontSize:26,fontWeight:800,color:"#111827"}}>{t(cfg.title,lang)}</h1>
        <span style={{display:"inline-block",padding:"4px 16px",borderRadius:20,background:"#fef2f2",color:"#dc2626",fontSize:12,fontWeight:700,letterSpacing:"0.05em"}}>{t("restricted",lang)}</span>
      </div>
      <div style={{background:"#fff",borderRadius:16,padding:28,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0",marginBottom:20}}>
        <h3 style={{margin:"0 0 8px",fontSize:14,fontWeight:700,color:cfg.color}}>{t("purpose",lang)}</h3>
        <p style={{margin:"0 0 20px",fontSize:13,color:"#374151",lineHeight:1.7}}>{t(cfg.desc,lang)}</p>
        <h3 style={{margin:"0 0 8px",fontSize:14,fontWeight:700,color:cfg.color}}>{t("whatItDoes",lang)}</h3>
        <p style={{margin:"0 0 20px",fontSize:13,color:"#374151",lineHeight:1.7}}>{t(cfg.what,lang)}</p>
        <h3 style={{margin:"0 0 8px",fontSize:14,fontWeight:700,color:cfg.color}}>{t("whyItMatters",lang)}</h3>
        <p style={{margin:0,fontSize:13,color:"#374151",lineHeight:1.7}}>{t(cfg.why,lang)}</p>
      </div>
      <div style={{textAlign:"left",padding:20,background:"#fef2f2",borderRadius:12,border:"1px solid #fecaca"}}>
        <p style={{margin:0,fontSize:13,color:"#991b1b",fontWeight:600}}>{t("accessContactAdmin",lang)}</p>
      </div>
    </div>
  );
}

function ComingSoonPage({section, lang, onBack}) {
  const configs = {
    reports: {title:"raTitle",desc:"raDesc",what:"raWhat",why:"raWhy",icon:"📈",color:"#d97706"},
  };
  const cfg = configs[section];
  if (!cfg) return null;
  return (
    <div style={{maxWidth:700,margin:"0 auto",padding:"40px 20px"}}>
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"#6b7280",fontSize:13,fontWeight:600,marginBottom:24,padding:0}}><ArrowLeft size={16}/> {t("backToDashboardNav",lang)}</button>
      <div style={{textAlign:"left",marginBottom:32}}>
        <span style={{fontSize:48}}>{cfg.icon}</span>
        <h1 style={{margin:"12px 0 8px",fontSize:26,fontWeight:800,color:"#111827"}}>{t(cfg.title,lang)}</h1>
        <span style={{display:"inline-block",padding:"4px 16px",borderRadius:20,background:"#fffbeb",color:"#d97706",fontSize:12,fontWeight:700,letterSpacing:"0.05em"}}>{t("comingSoon",lang)}</span>
      </div>
      <div style={{background:"#fff",borderRadius:16,padding:28,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0",marginBottom:20}}>
        <h3 style={{margin:"0 0 8px",fontSize:14,fontWeight:700,color:cfg.color}}>{t("purpose",lang)}</h3>
        <p style={{margin:"0 0 20px",fontSize:13,color:"#374151",lineHeight:1.7}}>{t(cfg.desc,lang)}</p>
        <h3 style={{margin:"0 0 8px",fontSize:14,fontWeight:700,color:cfg.color}}>{t("whatItDoes",lang)}</h3>
        <p style={{margin:"0 0 20px",fontSize:13,color:"#374151",lineHeight:1.7}}>{t(cfg.what,lang)}</p>
        <h3 style={{margin:"0 0 8px",fontSize:14,fontWeight:700,color:cfg.color}}>{t("whyItMatters",lang)}</h3>
        <p style={{margin:0,fontSize:13,color:"#374151",lineHeight:1.7}}>{t(cfg.why,lang)}</p>
      </div>
      <div style={{textAlign:"left",padding:20,background:"#fffbeb",borderRadius:12,border:"1px solid #fde68a"}}>
        <p style={{margin:0,fontSize:13,color:"#92400e",fontWeight:600}}>{t("featureUnderDev",lang)}</p>
      </div>
    </div>
  );
}

function UserGuidePage({lang, onBack}) {
  const statuses = [
    {en:"Compliant",ar:"ممتثل",desc:{en:"The control fully meets NDMO requirements. All evidence provided and accepted.",ar:"يستوفي الضابط جميع متطلبات المكتب الوطني. تم تقديم وقبول جميع الأدلة."},color:"#059669",bg:"#ecfdf5"},
    {en:"Partially Compliant",ar:"ممتثل جزئياً",desc:{en:"Some requirements are met but gaps remain. Remediation plan required.",ar:"تم استيفاء بعض المتطلبات لكن لا تزال هناك فجوات. يتطلب خطة معالجة."},color:"#d97706",bg:"#fffbeb"},
    {en:"Non-Compliant",ar:"غير ممتثل",desc:{en:"The control does not meet NDMO requirements. Immediate action needed.",ar:"لا يستوفي الضابط متطلبات المكتب الوطني. يلزم اتخاذ إجراء فوري."},color:"#dc2626",bg:"#fef2f2"},
    {en:"Not Applicable",ar:"غير قابل للتطبيق",desc:{en:"The control is not relevant to this sector for the current assessment cycle.",ar:"الضابط غير ذي صلة بهذا القطاع لدورة التقييم الحالية."},color:"#6b7280",bg:"#f3f4f6"},
  ];
  const workflows = [
    {en:"Open",ar:"مفتوح",desc:{en:"Control assigned to Data Steward. Steward collects evidence and prepares submission.",ar:"تم إسناد الضابط لأمين البيانات. يجمع الأمين الأدلة ويعد التقديم."},color:"#d97706",bg:"#fffbeb"},
    {en:"Ready for Review",ar:"جاهز للمراجعة",desc:{en:"Steward has submitted the control with a proposed compliance status. Awaiting Admin review.",ar:"قدم أمين البيانات الضابط مع حالة امتثال مقترحة. بانتظار مراجعة المدير."},color:"#6366f1",bg:"#eef2ff"},
    {en:"Closed",ar:"مغلق",desc:{en:"Admin has reviewed and accepted/overridden the compliance status. Control assessment is complete.",ar:"راجع المدير وقبل/عدّل حالة الامتثال. اكتمل تقييم الضابط."},color:"#059669",bg:"#ecfdf5"},
  ];
  const roles = [
    {title:{en:"DMO Admin",ar:"مدير مكتب إدارة البيانات"},desc:{en:"Full organizational oversight. Can view all levels (Organization → BU → Sector → Domain → Control), review submissions, close or reopen controls, and manage assignments.",ar:"إشراف تنظيمي كامل. يمكنه عرض جميع المستويات والمراجعة وإغلاق أو إعادة فتح الضوابط وإدارة الإسناد."}},
    {title:{en:"Data Steward",ar:"أمين البيانات"},desc:{en:"Sector-scoped access. Can view assigned controls, upload evidence, propose compliance status, submit for review, and collaborate with Admin via comments.",ar:"وصول على مستوى القطاع. يمكنه عرض الضوابط المسندة ورفع الأدلة واقتراح حالة الامتثال والتقديم للمراجعة والتعاون مع المدير عبر التعليقات."}},
  ];
  const levels = [
    {en:"Organization Overview",ar:"نظرة عامة على المنظمة"},{en:"Business Unit",ar:"وحدة الأعمال"},{en:"Sector",ar:"القطاع"},{en:"Domain",ar:"المجال"},{en:"Control",ar:"الضابط"}
  ];
  const isAr = lang === "ar";
  return (
    <div style={{maxWidth:800,margin:"0 auto",padding:"40px 20px"}}>
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"#6b7280",fontSize:13,fontWeight:600,marginBottom:24,padding:0}}><ArrowLeft size={16}/> {t("backToDashboardNav",lang)}</button>
      <h1 style={{fontSize:26,fontWeight:800,color:"#111827",marginBottom:8}}>{t("ugTitle",lang)}</h1>
      <p style={{color:"#6b7280",fontSize:13,lineHeight:1.7,marginBottom:28}}>{t("ugIntro",lang)}</p>

      <h2 style={{fontSize:18,fontWeight:700,color:"#0C7C8A",marginBottom:12}}>{t("ugComplianceStatuses",lang)}</h2>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
        {statuses.map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:10,background:s.bg,border:"1px solid "+s.color+"22"}}>
            <span style={{fontWeight:700,fontSize:13,color:s.color,minWidth:140}}>{isAr?s.ar:s.en}</span>
            <span style={{fontSize:12,color:"#374151"}}>{isAr?s.desc.ar:s.desc.en}</span>
          </div>
        ))}
      </div>

      <h2 style={{fontSize:18,fontWeight:700,color:"#0C7C8A",marginBottom:12}}>{t("ugWorkflowStatuses",lang)}</h2>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
        {workflows.map((w,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:10,background:w.bg,border:"1px solid "+w.color+"22"}}>
            <span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",background:w.color,flexShrink:0}}/>
            <span style={{fontWeight:700,fontSize:13,color:w.color,minWidth:140}}>{isAr?w.ar:w.en}</span>
            <span style={{fontSize:12,color:"#374151"}}>{isAr?w.desc.ar:w.desc.en}</span>
          </div>
        ))}
      </div>

      <h2 style={{fontSize:18,fontWeight:700,color:"#0C7C8A",marginBottom:12}}>{t("ugHowItWorks",lang)}</h2>
      <div style={{background:"#fff",borderRadius:12,padding:20,border:"1px solid #e5e7eb",marginBottom:28}}>
        {[
          {step:"1",en:"Admin assigns control to Steward → Status: Non-Compliant, Workflow: Open",ar:"يسند المدير الضابط لأمين البيانات ← الحالة: غير ممتثل، سير العمل: مفتوح"},
          {step:"2",en:"Steward uploads evidence, adds comments, prepares assessment",ar:"يرفع أمين البيانات الأدلة ويضيف التعليقات ويعد التقييم"},
          {step:"3",en:"Steward selects proposed compliance status and submits → Workflow: Ready for Review",ar:"يختار أمين البيانات حالة الامتثال المقترحة ويقدم ← سير العمل: جاهز للمراجعة"},
          {step:"4",en:"Admin reviews evidence and comments",ar:"يراجع المدير الأدلة والتعليقات"},
          {step:"5",en:"Admin accepts or overrides proposed status and closes → Workflow: Closed",ar:"يقبل المدير أو يعدّل الحالة المقترحة ويغلق ← سير العمل: مغلق"},
          {step:"6",en:"Alternatively, Admin reopens for rework → Workflow: Open (returned to steward)",ar:"بدلاً من ذلك، يعيد المدير الفتح للمراجعة ← سير العمل: مفتوح (أعيد لأمين البيانات)"},
        ].map((s,i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"8px 0",borderBottom:i<5?"1px solid #f3f4f6":"none"}}>
            <span style={{width:24,height:24,borderRadius:"50%",background:"#0C7C8A",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{s.step}</span>
            <span style={{fontSize:12,color:"#374151",lineHeight:1.6}}>{isAr?s.ar:s.en}</span>
          </div>
        ))}
      </div>

      <h2 style={{fontSize:18,fontWeight:700,color:"#0C7C8A",marginBottom:12}}>{t("ugRoles",lang)}</h2>
      <div style={{display:"flex",gap:12,marginBottom:28}}>
        {roles.map((r,i)=>(
          <div key={i} style={{flex:1,background:"#fff",borderRadius:12,padding:16,border:"1px solid #e5e7eb"}}>
            <h3 style={{margin:"0 0 8px",fontSize:14,fontWeight:700,color:"#111827"}}>{isAr?r.title.ar:r.title.en}</h3>
            <p style={{margin:0,fontSize:12,color:"#6b7280",lineHeight:1.6}}>{isAr?r.desc.ar:r.desc.en}</p>
          </div>
        ))}
      </div>

      <h2 style={{fontSize:18,fontWeight:700,color:"#0C7C8A",marginBottom:12}}>{t("ugNavigation",lang)}</h2>
      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        {levels.map((l,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
            {i>0 && <span style={{color:"#d1d5db",fontSize:16}}>→</span>}
            <span style={{padding:"6px 14px",borderRadius:8,background:i===0?"#0C7C8A":"#f3f4f6",color:i===0?"#fff":"#374151",fontSize:12,fontWeight:600}}>{isAr?l.ar:l.en}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutPortalPage({lang, onBack}) {
  const values = t("aboutValues",lang).split("|");
  return (
    <div style={{maxWidth:700,margin:"0 auto",padding:"40px 20px"}}>
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"#6b7280",fontSize:13,fontWeight:600,marginBottom:24,padding:0}}><ArrowLeft size={16}/> {t("backToDashboardNav",lang)}</button>
      <div style={{textAlign:"left",marginBottom:28}}>
        <Shield size={40} color="#059669" strokeWidth={2}/>
        <h1 style={{margin:"12px 0 8px",fontSize:26,fontWeight:800,color:"#111827"}}>{t("aboutTitle",lang)}</h1>
      </div>
      <div style={{background:"#fff",borderRadius:16,padding:28,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0",marginBottom:20}}>
        <h3 style={{margin:"0 0 8px",fontSize:16,fontWeight:700,color:"#0C7C8A"}}>{t("aboutObjective",lang)}</h3>
        <p style={{margin:"0 0 24px",fontSize:13,color:"#374151",lineHeight:1.8}}>{t("aboutObjectiveText",lang)}</p>
        <h3 style={{margin:"0 0 12px",fontSize:16,fontWeight:700,color:"#0C7C8A"}}>{t("aboutValueTitle",lang)}</h3>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
          {values.map((v,i)=>(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 12px",borderRadius:8,background:"#f0fdf4"}}>
              <CheckCircle size={16} color="#059669" style={{flexShrink:0,marginTop:2}}/>
              <span style={{fontSize:13,color:"#374151",lineHeight:1.5}}>{v}</span>
            </div>
          ))}
        </div>
        <h3 style={{margin:"0 0 10px",fontSize:16,fontWeight:700,color:"#0C7C8A"}}>Concept, Design & Development</h3>
        <div style={{background:"#f8fafc",borderRadius:12,padding:"18px 20px",border:"1px solid #e5e7eb"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#059669,#34d399)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:18,fontWeight:800,flexShrink:0}}>A</div>
            <div>
              <div style={{fontSize:15,fontWeight:800,color:"#111827",marginBottom:2}}>Mohammed Adnan</div>
              <div style={{fontSize:12,color:"#6366f1",fontWeight:600,marginBottom:8}}>Data Management Leader · 18+ Years Experience</div>
              <p style={{margin:"0 0 8px",fontSize:12,color:"#374151",lineHeight:1.7}}>This portal was conceived, designed, and developed by Mohammed Adnan — a certified Data Management professional with expertise spanning project management, product management, and data governance across Saudi Arabia and the wider region.</p>
              <p style={{margin:0,fontSize:12,color:"#374151",lineHeight:1.7}}>The concept draws on direct practitioner experience with NDMO compliance assessments, deep familiarity with the NDMO Standard (all 15 domains, 85 controls, 198 specifications), and hands-on implementation work across large-scale government and enterprise data programmes.</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{fontSize:11,color:"#9ca3af",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span>NDMO Compliance Portal · v1.0 · Prototype</span>
        <span>© 2026 Mohammed Adnan · All rights reserved</span>
      </div>
    </div>
  );
}

function NavPageRouter({navPage, lang, onBack}) {
  if (navPage === "userGuide") return <UserGuidePage lang={lang} onBack={onBack}/>;
  if (navPage === "about") return <AboutPortalPage lang={lang} onBack={onBack}/>;
  if (navPage === "reports") return <ComingSoonPage section="reports" lang={lang} onBack={onBack}/>;
  if (["aiEvidence","aiAdvisor","aiRisk"].includes(navPage)) return <RestrictedPage section={navPage} lang={lang} onBack={onBack}/>;
  return null;
}

// ═══ NEOM-WIDE AGGREGATION HELPERS ═══
function computeNEOMStats(allControls) {
  let totalControls=0, totalOpen=0, totalReview=0, totalClosed=0, totalCompliant=0;
  Object.values(allControls).forEach(ctrls => {
    ctrls.forEach(c => {
      totalControls++;
      if(c.workflow==="Open") totalOpen++;
      else if(c.workflow==="Ready for Review") totalReview++;
      else if(c.workflow==="Closed") totalClosed++;
      if(c.status==="Compliant") totalCompliant++;
    });
  });
  return {totalControls,totalOpen,totalReview,totalClosed,totalCompliant};
}

function computeBUStats(bu, allControls) {
  const sectorStats = bu.sectors.map(s => {
    const ctrls = allControls[s.id] || [];
    const domains = getDomainsForSectorWithControls(s.id, ctrls);
    const avg = domains.length > 0 ? Math.round(domains.reduce((a,d)=>a+d.compliance,0)/domains.length) : 0;
    const open = ctrls.filter(c=>c.workflow==="Open").length;
    const review = ctrls.filter(c=>c.workflow==="Ready for Review").length;
    const closed = ctrls.filter(c=>c.workflow==="Closed").length;
    return {sectorId:s.id, name:s.name, compliance:avg, controls:ctrls.length, open, review, closed};
  });
  const buAvg = sectorStats.length > 0 ? Math.round(sectorStats.reduce((a,s)=>a+s.compliance,0)/sectorStats.length) : 0;
  const totalReview = sectorStats.reduce((a,s)=>a+s.review,0);
  const totalOpen = sectorStats.reduce((a,s)=>a+s.open,0);
  const totalClosed = sectorStats.reduce((a,s)=>a+s.closed,0);
  return {buAvg, sectorStats, totalReview, totalOpen, totalClosed, totalControls:sectorStats.reduce((a,s)=>a+s.controls,0)};
}

// ═══ NEOM HEATMAP COMPONENT ═══
function NEOMHeatmap({allControls, onClickSector, onClickBU, lang}) {
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      {BUS.map(bu => {
        const stats = computeBUStats(bu, allControls);
        return (
          <div key={bu.id} style={{background:"#fff",borderRadius:16,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <button onClick={()=>onClickBU(bu.id)} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",padding:0}}>
                <span style={{fontSize:20}}>{bu.icon}</span>
                <div>
                  <div style={{fontSize:15,fontWeight:800,color:"#111827",textAlign:"left"}}>{bu.name}</div>
                  <div style={{fontSize:11,color:"#9ca3af",textAlign:"left"}}>{bu.sectors.length} {lang?t("sectors",lang):"sectors"} · {stats.totalControls} {lang?t("controls",lang):"controls"}</div>
                </div>
              </button>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:28,fontWeight:800,color:gc(stats.buAvg),fontFamily:"'DM Sans',sans-serif"}}>{stats.buAvg}%</div>
                <Badge value={stats.buAvg}/>
              </div>
            </div>
            {/* Sector heatmap grid */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:4}}>
              {stats.sectorStats.map(s => (
                <button key={s.sectorId} onClick={()=>onClickSector(bu.id, s.sectorId)}
                  title={s.name + ": " + s.compliance + "%"}
                  style={{padding:"8px 4px",borderRadius:8,border:"none",cursor:"pointer",textAlign:"center",
                    background:gc(s.compliance)+"18",transition:"all 0.15s",position:"relative"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                  <div style={{fontSize:14,fontWeight:800,color:gc(s.compliance)}}>{s.compliance}%</div>
                  <div style={{fontSize:8,color:"#6b7280",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100%"}}>{s.name.split(" ")[0]}</div>
                  {s.review > 0 && <span style={{position:"absolute",top:2,right:2,width:6,height:6,borderRadius:"50%",background:"#6366f1"}}/>}
                </button>
              ))}
            </div>
            {/* BU workflow summary */}
            <div style={{marginTop:12,paddingTop:10,borderTop:"1px solid #f3f4f6"}}>
              <div style={{display:"flex",borderRadius:4,overflow:"hidden",height:6,background:"#f3f4f6",marginBottom:8}}>
                {stats.totalControls>0 && <div style={{width:`${(stats.totalClosed/stats.totalControls)*100}%`,background:"#059669"}}/>}
                {stats.totalControls>0 && <div style={{width:`${(stats.totalReview/stats.totalControls)*100}%`,background:"#6366f1"}}/>}
                {stats.totalControls>0 && <div style={{width:`${(stats.totalOpen/stats.totalControls)*100}%`,background:"#d97706"}}/>}
              </div>
              <div style={{display:"flex",gap:12}}>
                <div style={{flex:1,textAlign:"center"}}><div style={{fontSize:15,fontWeight:700,color:"#d97706"}}>{stats.totalOpen}</div><div style={{fontSize:9,color:"#9ca3af"}}>{lang?t("open",lang):"Open"}</div></div>
                <div style={{flex:1,textAlign:"center"}}><div style={{fontSize:15,fontWeight:700,color:"#6366f1"}}>{stats.totalReview}</div><div style={{fontSize:9,color:"#9ca3af"}}>{lang?t("review",lang):"Review"}</div></div>
                <div style={{flex:1,textAlign:"center"}}><div style={{fontSize:15,fontWeight:700,color:"#059669"}}>{stats.totalClosed}</div><div style={{fontSize:9,color:"#9ca3af"}}>{lang?t("closed",lang):"Closed"}</div></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══ BU DOMAIN HEATMAP (for BU-level view) ═══
function BUSectorTable({bu, allControls, onClickSector, lang}) {
  const stats = computeBUStats(bu, allControls);
  return (
    <div style={{background:"#fff",borderRadius:16,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0"}}>
      <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:700,color:"#374151"}}>{bu.icon} {bu.name} — {t("allSectors",lang||"en")} ({bu.sectors.length})</h3>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{borderBottom:"2px solid #f3f4f6"}}>
          {[t("sector",lang),t("compliance",lang),t("controls",lang),t("open",lang),t("review",lang),t("closed",lang),""].map(h=>(
            <th key={h} style={{textAlign:"left",padding:"8px 10px",color:"#6b7280",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {stats.sectorStats.map(s => (
            <tr key={s.sectorId} style={{borderBottom:"1px solid #f9fafb",cursor:"pointer"}}
              onClick={()=>onClickSector(s.sectorId)}
              onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{padding:"10px"}}><div style={{fontWeight:600,color:"#374151"}}>{s.name}</div></td>
              <td style={{padding:"10px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:60,height:8,borderRadius:4,background:"#f3f4f6",overflow:"hidden"}}>
                    <div style={{width:`${s.compliance}%`,height:"100%",borderRadius:4,background:gc(s.compliance)}}/>
                  </div>
                  <span style={{fontSize:13,fontWeight:700,color:gc(s.compliance)}}>{s.compliance}%</span>
                </div>
              </td>
              <td style={{padding:"10px",fontSize:12,color:"#6b7280"}}>{s.controls}</td>
              <td style={{padding:"10px"}}><span style={{fontWeight:600,color:s.open>0?"#d97706":"#9ca3af"}}>{s.open}</span></td>
              <td style={{padding:"10px"}}>{s.review>0?<span style={{padding:"2px 8px",borderRadius:10,background:"#eef2ff",color:"#6366f1",fontWeight:700,fontSize:11}}>{s.review}</span>:<span style={{color:"#9ca3af"}}>0</span>}</td>
              <td style={{padding:"10px"}}><span style={{fontWeight:600,color:s.closed>0?"#059669":"#9ca3af"}}>{s.closed}</span></td>
              <td style={{padding:"10px"}}><ChevronRight size={14} color="#9ca3af"/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══ ADMIN BREADCRUMB ═══
function AdminBreadcrumb({items}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:20,fontSize:13}}>
      {items.map((item,i) => (
        <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
          {i > 0 && <span style={{color:"#d1d5db"}}>›</span>}
          {item.onClick ? (
            <button onClick={item.onClick} style={{background:"none",border:"none",cursor:"pointer",color:"#6366f1",fontWeight:600,padding:0,fontSize:13}}>{item.label}</button>
          ) : (
            <span style={{color:"#374151",fontWeight:700}}>{item.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══ ADMIN DASHBOARD ═══
function AdminDashboard({onLogout, allControls, setAllControls, lang, setLang}) {
  // View hierarchy: neom → bu → sector → domain → control
  const [adminView,setAdminView] = useState("neom");
  const [navPage,setNavPage] = useState(null);
  const [sideNavOpen,setSideNavOpen] = useState(false); // "neom" | "bu" | "sector"
  const [selBU,setSelBU]=useState(null);
  const [selSectorId,setSelSectorId]=useState(null);
  const [selDomain,setSelDomain]=useState(null);
  const [selCtrlIdx,setSelCtrlIdx]=useState(null);

  const curBU = selBU ? BUS.find(b=>b.id===selBU) : null;
  const controls = selSectorId ? (allControls[selSectorId] || []) : [];
  const setControls = (nc) => { if(selSectorId) setAllControls(p => ({...p, [selSectorId]: typeof nc==="function"?nc(p[selSectorId]):nc})); };
  const domains = useMemo(()=> selSectorId ? getDomainsForSectorWithControls(selSectorId, controls) : [], [selSectorId, controls]);
  const kpis = useMemo(()=>computeKpis(domains),[domains]);
  const neomStats = useMemo(()=>computeNEOMStats(allControls),[allControls]);

  const radarData = domains.map(d=>({domain:d.id,fullName:d.name,compliance:d.compliance,fullMark:100}));
  const trendData = MONTHS.map((m,i)=>({month:m,overall:domains.length>0?Math.round(domains.reduce((a,d)=>a+d.trend[i],0)/domains.length):0}));

  const handleRadarClick = useCallback(e => {
    if(e?.activePayload?.[0]?.payload){const cl=e.activePayload[0].payload;const dom=domains.find(d=>d.id===cl.domain);if(dom){setSelDomain(dom);setAdminView("sector");}}
  },[domains]);

  const goNEOM = () => { setAdminView("neom"); setSelBU(null); setSelSectorId(null); setSelDomain(null); setSelCtrlIdx(null); };
  const goBU = (buId) => { setAdminView("bu"); setSelBU(buId); setSelSectorId(null); setSelDomain(null); setSelCtrlIdx(null); };
  const goSector = (buId, sectorId) => { setAdminView("sector"); setSelBU(buId); setSelSectorId(sectorId); setSelDomain(null); setSelCtrlIdx(null); };

  // Shared topbar
  const TopBar = (
    <div style={{background:"#fff",borderBottom:"1px solid #f0f0f0",padding:"12px 28px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <MenuButton lang={lang} onClick={()=>setSideNavOpen(true)}/>
        <Shield size={20} color="#059669" strokeWidth={2.5}/>
        <span style={{fontSize:15,fontWeight:800,color:"#111827"}}>{t("ndmoPortal",lang)}</span>
        <span style={{fontSize:12,color:"#9ca3af",marginLeft:4}}>{t("dmoAdmin",lang)}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        <span style={{fontSize:11,color:"#9ca3af"}}>{t('loggedInAs',lang)} <strong style={{color:"#374151"}}>{t('dataManagementOfficeAdmin',lang)}</strong></span>
        <LangToggle lang={lang} setLang={setLang}/>
        <button onClick={onLogout} style={{display:"flex",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",color:"#ef4444",fontSize:12,fontWeight:600}}><LogOut size={14}/> {t('signOut',lang)}</button>
      </div>
    </div>
  );

  const SideNavEl = <SideNav lang={lang} onNav={(k)=>{setNavPage(k);setSideNavOpen(false);}} currentNav={navPage} isOpen={sideNavOpen} onClose={()=>setSideNavOpen(false)} role="admin"/>;

  // ─── NAV PAGES ───
  if (navPage) {
    return (
      <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"'DM Sans','Segoe UI',sans-serif",textAlign:"left"}}>
        {SideNavEl}
        {TopBar}
        <NavPageRouter navPage={navPage} lang={lang} onBack={()=>setNavPage(null)}/>
        <AppFooter/>
      </div>
    );
  }

  // ─── CONTROL DETAIL ───
  if (selCtrlIdx !== null && selSectorId) {
    const sectorName = getSector(selSectorId)?.name || "";
    return (
      <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"'DM Sans','Segoe UI',sans-serif",textAlign:"left"}}>
        {SideNavEl}
        {TopBar}
        <div style={{padding:28,textAlign:"left"}}>
          <AdminBreadcrumb items={[
            {label:t("neomOverview",lang),onClick:goNEOM},
            {label:curBU?.name,onClick:()=>goBU(selBU)},
            {label:sectorName,onClick:()=>goSector(selBU,selSectorId)},
            {label:controls[selCtrlIdx]?.cid}
          ]}/>
          <ControlDetailView ctrl={controls[selCtrlIdx]} ctrlIdx={selCtrlIdx} controls={controls} setControls={setControls} viewer="admin" lang={lang} onBack={()=>setSelCtrlIdx(null)}/>
        </div>
        <AppFooter/>
      </div>
    );
  }

  // ─── DOMAIN DETAIL (within sector) ───
  if (selDomain && selSectorId) {
    const sectorName = getSector(selSectorId)?.name || "";
    return (
      <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"'DM Sans','Segoe UI',sans-serif",textAlign:"left"}}>
        {SideNavEl}
        {TopBar}
        <div style={{padding:28,textAlign:"left"}}>
          <AdminBreadcrumb items={[
            {label:t("neomOverview",lang),onClick:goNEOM},
            {label:curBU?.name,onClick:()=>goBU(selBU)},
            {label:sectorName,onClick:()=>{setSelDomain(null);setAdminView("sector");}},
            {label:selDomain.id+": "+selDomain.name}
          ]}/>
          <DomainDetail lang={lang} domain={selDomain} buName={(curBU?.name||"")+" › "+sectorName} controls={controls} setControls={setControls} onBack={()=>setSelDomain(null)} onOpenControl={(idx)=>setSelCtrlIdx(idx)}/>
        </div>
        <AppFooter/>
      </div>
    );
  }

  // ─── SECTOR VIEW (radar + controls table) ───
  if (adminView === "sector" && selSectorId) {
    const sectorName = getSector(selSectorId)?.name || "";
    const readyCount = controls.filter(c=>c.workflow==="Ready for Review").length;
    return (
      <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"'DM Sans','Segoe UI',sans-serif",textAlign:"left"}}>
        {SideNavEl}
        {TopBar}
        <div style={{padding:28,textAlign:"left"}}>
          <AdminBreadcrumb items={[
            {label:t("neomOverview",lang),onClick:goNEOM},
            {label:curBU?.name,onClick:()=>goBU(selBU)},
            {label:sectorName}
          ]}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <div>
              <h1 style={{margin:0,fontSize:24,fontWeight:800,color:"#111827"}}>{curBU?.icon} {sectorName}</h1>
              <p style={{margin:"4px 0 0",color:"#9ca3af",fontSize:13}}>{curBU?.name} · {controls.length} controls · {readyCount} awaiting review</p>
            </div>
            <div style={{fontSize:32,fontWeight:800,color:gc(kpis.overall),fontFamily:"'DM Sans',sans-serif"}}>{kpis.overall}%</div>
          </div>

          <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
            <KpiCard icon={<TrendingUp size={18} color="#059669"/>} label={t("sectorCompliance",lang)} value={kpis.overall+"%"} sub={sectorName} accent="#ecfdf5"/>
            <KpiCard icon={<Layers size={18} color="#6366f1"/>} label={t("totalSpecs",lang)} value={kpis.ts} sub={t("across15Domains",lang)} accent="#eef2ff"/>
            <KpiCard icon={<AlertTriangle size={18} color="#dc2626"/>} label={t("domainsAtRisk",lang)} value={kpis.atRisk} sub={t("below50",lang)} accent="#fef2f2"/>
            <KpiCard icon={<Eye size={18} color="#6366f1"/>} label={t("readyForReview",lang)} value={readyCount} sub={t("awaitingAdmin",lang)} accent="#eef2ff"/>
          </div>

          <div style={{display:"flex",gap:20,marginBottom:24}}>
            <div style={{flex:2,background:"#fff",borderRadius:16,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><h3 style={{margin:0,fontSize:14,fontWeight:700,color:"#374151"}}>{t("domainCompliance",lang)}</h3><span style={{fontSize:11,color:"#9ca3af"}}>{t("clickToDrillDown",lang)}</span></div>
              <ResponsiveContainer width="100%" height={340}>
                <RadarChart data={radarData} onClick={handleRadarClick} style={{cursor:"pointer"}}>
                  <PolarGrid stroke="#e5e7eb" gridType="polygon"/><PolarAngleAxis dataKey="domain" tick={{fontSize:10,fill:"#6b7280",fontWeight:600}}/><PolarRadiusAxis domain={[0,100]} tick={{fontSize:9,fill:"#9ca3af"}} axisLine={false}/>
                  <Radar name="Background" dataKey="fullMark" fill="#9ca3af" fillOpacity={0.04} stroke="none" dot={false}/>
                  <Radar dataKey="compliance" stroke="#059669" fill="#059669" fillOpacity={0.12} strokeWidth={2}
                    dot={(dotProps) => {
                      const dom = domains.find(d => d.id === dotProps.payload?.domain);
                      return <RadarDot {...dotProps} onDotClick={() => { if(dom){ setSelDomain(dom); } }} />;
                    }}
                  />
                  <RTooltip content={<RadarTooltipContent/>} wrapperStyle={{outline:"none"}}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:16}}>
              <div style={{background:"#fff",borderRadius:16,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0",flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><AlertTriangle size={16} color="#dc2626"/><h3 style={{margin:0,fontSize:13,fontWeight:700,color:"#dc2626"}}>{t("domainsAtRisk",lang)}</h3></div>
                {domains.filter(d=>d.compliance<55).sort((a,b)=>a.compliance-b.compliance).length===0?(<div style={{padding:"20px 0",textAlign:"left",color:"#9ca3af",fontSize:13}}>{t("allAbove55",lang)}</div>):(
                  domains.filter(d=>d.compliance<55).sort((a,b)=>a.compliance-b.compliance).map(d=>(<button key={d.id} onClick={()=>setSelDomain(d)} style={{display:"flex",alignItems:"center",width:"100%",padding:"8px 0",background:"none",border:"none",cursor:"pointer",borderBottom:"1px solid #fef2f2",textAlign:"left"}}><StatusDot value={d.compliance}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#374151"}}>{d.name}</div></div><span style={{fontSize:14,fontWeight:800,color:gc(d.compliance)}}>{d.compliance}%</span></button>))
                )}
              </div>
              <div style={{background:"#fff",borderRadius:16,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0"}}>
                <h3 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:"#374151"}}>{t("trend",lang)}</h3>
                <ResponsiveContainer width="100%" height={120}><LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/><XAxis dataKey="month" tick={{fontSize:10,fill:"#9ca3af"}}/><YAxis domain={[0,100]} tick={{fontSize:10,fill:"#9ca3af"}}/><Tooltip/><Line type="monotone" dataKey="overall" stroke="#059669" strokeWidth={2} dot={{r:3,fill:"#059669"}} name={t("overallCompliance",lang||"en")}/></LineChart></ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Controls table */}
          <div style={{background:"#fff",borderRadius:16,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0"}}>
            <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:700,color:"#374151"}}>{t("allAssignedControls",lang)} ({controls.length})</h3>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{borderBottom:"2px solid #f3f4f6"}}>
                {[t("control",lang),t("domain",lang),t("steward",lang),t("priority",lang),t("status",lang),t("workflow",lang),t("proposed",lang),t("comments",lang),t("evidence",lang),""].map(h=>(<th key={h} style={{textAlign:"left",padding:"8px 8px",color:"#6b7280",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>{h}</th>))}
              </tr></thead>
              <tbody>
                {controls.map((c,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid #f9fafb",cursor:"pointer",background:c.workflow==="Ready for Review"?"#fafbff":"transparent"}} onClick={()=>setSelCtrlIdx(i)}
                    onMouseEnter={e=>e.currentTarget.style.background=c.workflow==="Ready for Review"?"#eef2ff":"#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background=c.workflow==="Ready for Review"?"#fafbff":"transparent"}>
                    <td style={{padding:"10px 8px"}}><div style={{fontWeight:700,color:"#374151"}}>{c.cid}</div><div style={{fontSize:11,color:"#6b7280"}}>{c.cn}</div></td>
                    <td style={{padding:"10px 8px",fontSize:12,color:"#6b7280"}}>{c.domainName}</td>
                    <td style={{padding:"10px 8px",fontSize:12,color:"#6b7280"}}>{c.steward}</td>
                    <td style={{padding:"10px 8px"}}><span style={{padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700,background:c.priority==="P1"?"#fef2f2":c.priority==="P2"?"#fffbeb":"#f0fdf4",color:c.priority==="P1"?"#dc2626":c.priority==="P2"?"#d97706":"#059669"}}>{c.priority}</span></td>
                    <td style={{padding:"10px 8px"}}><StatusBadge status={c.status} lang={lang||"en"}/></td>
                    <td style={{padding:"10px 8px"}}><WorkflowBadge wf={c.workflow} lang={lang||"en"}/></td>
                    <td style={{padding:"10px 8px",fontSize:11,color:c.proposedStatus?STATUS_COLORS[c.proposedStatus]:"#9ca3af"}}>{c.proposedStatus||"—"}</td>
                    <td style={{padding:"10px 8px",fontSize:12,color:"#6b7280"}}>{c.comments.length}</td>
                    <td style={{padding:"10px 8px",fontSize:12,color:"#6b7280"}}>{c.evidence.length}</td>
                    <td style={{padding:"10px 8px"}}><ChevronRight size={14} color="#9ca3af"/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <AppFooter/>
      </div>
    );
  }

  // ─── BU VIEW (sector list for one BU) ───
  if (adminView === "bu" && selBU) {
    const buStats = computeBUStats(curBU, allControls);
    // Aggregate domain compliance across all sectors, accounting for control closures
    const buDomains = DOMAIN_DEFS.map(d => {
      const scores = curBU.sectors.map(s => {
        const sCtrls = allControls[s.id] || [];
        const sDoms = getDomainsForSectorWithControls(s.id, sCtrls);
        const found = sDoms.find(dd => dd.id === d.id);
        return found ? found.compliance : sectorDomainScore(s.id, d.id, curBU.maturity);
      });
      const avg = Math.round(scores.reduce((a,v)=>a+v,0)/scores.length);
      return {...d, compliance:avg, trend:sectorTrend(avg)};
    });
    const buRadar = buDomains.map(d=>({domain:d.id,fullName:d.name,compliance:d.compliance,fullMark:100}));
    return (
      <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"'DM Sans','Segoe UI',sans-serif",textAlign:"left"}}>
        {SideNavEl}
        {TopBar}
        <div style={{padding:28,textAlign:"left"}}>
          <AdminBreadcrumb items={[{label:t("neomOverview",lang),onClick:goNEOM},{label:curBU.name}]}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <div>
              <h1 style={{margin:0,fontSize:24,fontWeight:800,color:"#111827"}}>{curBU.icon} {curBU.name}</h1>
              <p style={{margin:"4px 0 0",color:"#9ca3af",fontSize:13}}>{curBU.sectors.length} {t("sectors",lang)} · {buStats.totalControls} {t("controls",lang)} · {buStats.totalReview} awaiting review</p>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:36,fontWeight:800,color:gc(buStats.buAvg),fontFamily:"'DM Sans',sans-serif"}}>{buStats.buAvg}%</div>
              <Badge value={buStats.buAvg}/>
            </div>
          </div>

          <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
            <KpiCard icon={<TrendingUp size={18} color="#059669"/>} label={t("buCompliance",lang)} value={buStats.buAvg+"%"} sub={t("avgAcross",lang)+" "+curBU.sectors.length+" "+t("sectors",lang)} accent="#ecfdf5"/>
            <KpiCard icon={<AlertTriangle size={18} color="#d97706"/>} label={t("openControls",lang)} value={buStats.totalOpen} sub={t("acrossAllSectors",lang)} accent="#fffbeb"/>
            <KpiCard icon={<Eye size={18} color="#6366f1"/>} label={t("readyForReview",lang)} value={buStats.totalReview} sub={t("awaitingAdmin",lang)} accent="#eef2ff"/>
            <KpiCard icon={<CheckCircle size={18} color="#059669"/>} label={t("closed",lang)} value={buStats.totalClosed} sub={t("completed",lang)} accent="#ecfdf5"/>
          </div>

          <div style={{display:"flex",gap:20,marginBottom:24}}>
            {/* BU-level radar */}
            <div style={{flex:1,background:"#fff",borderRadius:16,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0"}}>
              <h3 style={{margin:"0 0 8px",fontSize:14,fontWeight:700,color:"#374151"}}>{curBU.icon} {curBU.name} — {t("domainComplianceAggregated",lang)}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={buRadar}>
                  <PolarGrid stroke="#e5e7eb" gridType="polygon"/><PolarAngleAxis dataKey="domain" tick={{fontSize:10,fill:"#6b7280",fontWeight:600}}/><PolarRadiusAxis domain={[0,100]} tick={{fontSize:9,fill:"#9ca3af"}} axisLine={false}/>
                  <Radar name="Background" dataKey="fullMark" fill="#9ca3af" fillOpacity={0.04} stroke="none" dot={false}/>
                  <Radar dataKey="compliance" stroke="#059669" fill="#059669" fillOpacity={0.12} strokeWidth={2} dot={{r:5,fill:"#9ca3af",stroke:"#fff",strokeWidth:2}}/>
                  <RTooltip content={<RadarTooltipContent/>} wrapperStyle={{outline:"none"}}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
            {/* Weakest domains */}
            <div style={{width:300,background:"#fff",borderRadius:16,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0"}}>
              <h3 style={{margin:"0 0 14px",fontSize:13,fontWeight:700,color:"#dc2626",display:"flex",alignItems:"center",gap:6}}><AlertTriangle size={15}/> {t("weakestDomains",lang)}</h3>
              {buDomains.sort((a,b)=>a.compliance-b.compliance).slice(0,6).map(d=>(
                <div key={d.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid #f9fafb"}}>
                  <StatusDot value={d.compliance}/>
                  <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:"#374151"}}>{d.name}</div></div>
                  <span style={{fontSize:14,fontWeight:700,color:gc(d.compliance)}}>{d.compliance}%</span>
                </div>
              ))}
            </div>
          </div>

          <BUSectorTable bu={curBU} allControls={allControls} lang={lang} onClickSector={(sid)=>goSector(selBU,sid)}/>
        </div>
        <AppFooter/>
      </div>
    );
  }

  // ─── NEOM OVERVIEW (default landing) ───
  const neomAvg = BUS.length > 0 ? Math.round(BUS.map(bu=>computeBUStats(bu,allControls).buAvg).reduce((a,v)=>a+v,0)/BUS.length) : 0;
  return (
    <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"'DM Sans','Segoe UI',sans-serif",textAlign:"left"}}>
      {SideNavEl}
      {TopBar}
      <div style={{padding:28,textAlign:"left"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div>
            <h1 style={{margin:0,fontSize:26,fontWeight:800,color:"#111827",letterSpacing:"-0.02em"}}>{t('neomComplianceOverview',lang)}</h1>
            <p style={{margin:"4px 0 0",color:"#9ca3af",fontSize:13}}>{t('ndmoDataManagement',lang)} — 4 {t('businessUnits',lang)} · 40 {t('sectors',lang)} · {neomStats.totalControls} {t('activeControls',lang)}</p>
            <p style={{margin:"2px 0 0",color:"#d1d5db",fontSize:11,display:"flex",alignItems:"center",gap:4}}><span style={{width:6,height:6,borderRadius:"50%",background:"#34d399",display:"inline-block"}}/>{t("updatedJustNow",lang)}</p>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:40,fontWeight:800,color:gc(neomAvg),fontFamily:"'DM Sans',sans-serif"}}>{neomAvg}%</div>
            <Badge value={neomAvg}/>
          </div>
        </div>

        {/* NEOM KPIs */}
        <div style={{display:"flex",gap:14,marginBottom:24,flexWrap:"wrap"}}>
          <KpiCard icon={<TrendingUp size={18} color="#059669"/>} label={t("neomCompliance",lang)} value={neomAvg+"%"} sub={t("acrossAllSectors",lang)} accent="#ecfdf5"/>
          <KpiCard icon={<Layers size={18} color="#6366f1"/>} label={t("activeControls",lang)} value={neomStats.totalControls} sub={t("acrossAllSectors",lang)} accent="#eef2ff"/>
          <KpiCard icon={<AlertTriangle size={18} color="#d97706"/>} label={t("open",lang)} value={neomStats.totalOpen} sub={t("inProgress",lang)} accent="#fffbeb"/>
          <KpiCard icon={<Eye size={18} color="#6366f1"/>} label={t("review",lang)} value={neomStats.totalReview} sub={t("awaitingAdmin",lang)} accent="#eef2ff"/>
          <KpiCard icon={<CheckCircle size={18} color="#059669"/>} label={t("closed",lang)} value={neomStats.totalClosed} sub={t("completed",lang)} accent="#ecfdf5"/>
          <KpiCard icon={<Shield size={18} color="#dc2626"/>} label={t("compliant",lang)} value={neomStats.totalCompliant} sub={neomStats.totalCompliant+"/"+neomStats.totalControls+" "+t("controls",lang)} accent="#fef2f2"/>
        </div>

        {/* BU Heatmap Cards */}
        <NEOMHeatmap allControls={allControls} lang={lang} onClickBU={(buId)=>goBU(buId)} onClickSector={(buId,sid)=>goSector(buId,sid)}/>
      </div>
      <AppFooter/>
    </div>
  );
}

// ═══ DATA STEWARD DASHBOARD ═══
function StewardDashboard({onLogout, allControls, setAllControls, lang, setLang}) {
  const [sectorId, setSectorId] = useState(null);
  const [selCtrlIdx, setSelCtrlIdx] = useState(null);
  const [navPage, setNavPage] = useState(null);
  const [sideNavOpen, setSideNavOpen] = useState(false);

  const sec = sectorId ? getSector(sectorId) : null;
  const bu = sectorId ? getBUForSector(sectorId) : null;
  const controls = sectorId ? (allControls[sectorId] || []) : [];
  const setControls = (nc) => { if(sectorId) setAllControls(p => ({...p, [sectorId]: typeof nc==="function"?nc(p[sectorId]):nc})); };
  const steward = sectorId ? getCurrentSteward(sectorId) : {name:"",role:""};
  const stewards = sectorId ? getStewardsForSector(sectorId) : [];
  const allDom = useMemo(()=> sectorId ? getDomainsForSectorWithControls(sectorId, controls) : [], [sectorId, controls]);
  const radarData = allDom.map(d=>({domain:d.id,fullName:d.name,compliance:d.compliance,fullMark:100}));
  const actions = useMemo(()=>getStewardActions(controls),[controls]);

  // ─── SECTOR SELECTION ───
  if (!sectorId) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
        background:"linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%)",fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,opacity:0.04,
          backgroundImage:"radial-gradient(circle at 1px 1px,white 1px,transparent 0)",backgroundSize:"40px 40px"}}/>
        <div style={{zIndex:1,width:"100%",maxWidth:700,padding:"0 20px"}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><LangToggle lang={lang} setLang={setLang}/></div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:8}}>
              <Shield size={28} color="#34d399" strokeWidth={2.5}/>
              <span style={{fontSize:22,fontWeight:800,color:"#f1f5f9"}}>{t('selectYourSector',lang)}</span>
            </div>
            <p style={{color:"#94a3b8",fontSize:13}}>{t('selectSectorDesc',lang)}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {BUS.map(b => (
              <div key={b.id} style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",borderRadius:16,
                padding:"20px",border:"1px solid rgba(255,255,255,0.08)"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                  <span style={{fontSize:18}}>{b.icon}</span>
                  <span style={{fontSize:14,fontWeight:700,color:"#f1f5f9"}}>{b.name}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  {b.sectors.map(s => (
                    <button key={s.id} onClick={()=>setSectorId(s.id)}
                      style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:10,
                        border:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.02)",
                        cursor:"pointer",textAlign:"left",width:"100%",color:"#e2e8f0",transition:"all 0.15s"}}
                      onMouseEnter={e=>{e.currentTarget.style.background="rgba(52,211,153,0.1)";e.currentTarget.style.borderColor="rgba(52,211,153,0.3)";}}
                      onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.02)";e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600}}>{s.name}</div>
                        <div style={{fontSize:10,color:"#94a3b8"}}>{(allControls[s.id]||[]).length} {t("controls",lang||"en")}</div>
                      </div>
                      <ChevronRight size={14} color="#6b7280"/>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:20}}>
            <button onClick={onLogout} style={{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",fontSize:12,fontWeight:600}}>{t('backToLogin',lang)}</button>
          </div>
        </div>
      </div>
    );
  }

  // Shared topbar
  const TopBar = (
    <div style={{background:"#fff",borderBottom:"1px solid #f0f0f0",padding:"12px 28px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <MenuButton lang={lang} onClick={()=>setSideNavOpen(true)}/>
        <Shield size={20} color="#059669" strokeWidth={2.5}/>
        <span style={{fontSize:15,fontWeight:800,color:"#111827"}}>{t("ndmoPortal",lang)}</span>
        <span style={{fontSize:12,color:"#9ca3af",marginLeft:4}}>{t("dataSteward",lang)} · <span style={{color:"#6366f1",fontWeight:600}}>{bu?.icon} {bu?.name} › {sec?.name}</span></span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:12,color:"#374151",fontWeight:600}}>{steward.name}</span>
        <LangToggle lang={lang} setLang={setLang}/>
        <button onClick={()=>setSectorId(null)} style={{fontSize:12,color:"#6366f1",fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>{t('switchSector',lang)}</button>
        <button onClick={onLogout} style={{display:"flex",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",color:"#ef4444",fontSize:12,fontWeight:600}}><LogOut size={14}/> {t("signOut",lang)}</button>
      </div>
    </div>
  );

  const SideNavEl = <SideNav lang={lang} onNav={(k)=>{setNavPage(k);setSideNavOpen(false);}} currentNav={navPage} isOpen={sideNavOpen} onClose={()=>setSideNavOpen(false)} role="steward"/>;

  // ─── NAV PAGES ───
  if (navPage) {
    return (
      <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"'DM Sans','Segoe UI',sans-serif",textAlign:"left"}}>
        {SideNavEl}
        {TopBar}
        <NavPageRouter navPage={navPage} lang={lang} onBack={()=>setNavPage(null)}/>
        <AppFooter/>
      </div>
    );
  }

  // ─── CONTROL DETAIL ───
  if (selCtrlIdx !== null) {
    return (
      <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"'DM Sans','Segoe UI',sans-serif",textAlign:"left"}}>
        {SideNavEl}
        {TopBar}
        <div style={{padding:28,textAlign:"left"}}>
          <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:16,fontSize:12,color:"#9ca3af"}}>
            <span>{bu?.icon} {bu?.name}</span><span>›</span><span style={{color:"#6366f1",fontWeight:600}}>{sec?.name}</span><span>›</span><span style={{color:"#374151",fontWeight:700}}>{controls[selCtrlIdx]?.cid}</span>
          </div>
          <ControlDetailView ctrl={controls[selCtrlIdx]} ctrlIdx={selCtrlIdx} controls={controls} setControls={setControls} viewer="steward" lang={lang} onBack={()=>setSelCtrlIdx(null)}/>
        </div>
        <AppFooter/>
      </div>
    );
  }

  // ─── HOME PAGE ───
  const compCount = controls.filter(c=>c.status==="Compliant").length;
  const pendCount = controls.filter(c=>c.status!=="Compliant"&&c.status!=="Not Applicable").length;
  const sectorCompliance = allDom.length > 0 ? Math.round(allDom.reduce((a,d)=>a+d.compliance,0)/allDom.length) : 0;

  return (
    <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"'DM Sans','Segoe UI',sans-serif",textAlign:"left"}}>
      {SideNavEl}
      {TopBar}
      <div style={{padding:28,textAlign:"left"}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
          <div>
            <h1 style={{margin:"0 0 4px",fontSize:24,fontWeight:800,color:"#111827"}}>{t('welcome',lang)} {steward.name}</h1>
            <p style={{margin:0,color:"#9ca3af",fontSize:13}}>{steward.role} · {bu?.icon} {bu?.name} › {sec?.name} · {controls.length} controls assigned</p>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:32,fontWeight:800,color:gc(sectorCompliance),fontFamily:"'DM Sans',sans-serif"}}>{sectorCompliance}%</div>
            <Badge value={sectorCompliance}/>
          </div>
        </div>

        {/* KPIs */}
        <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
          <KpiCard icon={<Layers size={18} color="#6366f1"/>} label={t("assignedControls",lang)} value={controls.length} sub={t("acrossMultipleDomains",lang)} accent="#eef2ff"/>
          <KpiCard icon={<CheckCircle size={18} color="#059669"/>} label={t("compliant",lang)} value={compCount} sub={controls.length>0?`${Math.round(compCount/controls.length*100)}%`:"—"} accent="#ecfdf5"/>
          <KpiCard icon={<AlertTriangle size={18} color="#dc2626"/>} label={t("pending",lang)} value={pendCount} sub={t("requireAttention",lang)} accent="#fef2f2"/>
          <KpiCard icon={<Activity size={18} color="#d97706"/>} label={t("openActions",lang)} value={actions.length} sub={t("inQueue",lang)} accent="#fffbeb"/>
        </div>

        {/* Row: Radar + Actions + Stewards */}
        <div style={{display:"flex",gap:16,marginBottom:24}}>
          {/* Radar */}
          <div style={{flex:1,background:"#fff",borderRadius:16,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0",minWidth:0}}>
            <h3 style={{margin:"0 0 4px",fontSize:13,fontWeight:700,color:"#374151"}}>{sec?.name} — {t("domainCompliance",lang||"en")}</h3>
            <p style={{margin:"0 0 4px",fontSize:10,color:"#9ca3af"}}>{t("readOnlyView",lang||"en")} · {bu?.name}</p>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" gridType="polygon"/>
                <PolarAngleAxis dataKey="domain" tick={{fontSize:9,fill:"#6b7280",fontWeight:600}}/>
                <PolarRadiusAxis domain={[0,100]} tick={{fontSize:8,fill:"#9ca3af"}} axisLine={false}/>
                <Radar name="Background" dataKey="fullMark" fill="#9ca3af" fillOpacity={0.04} stroke="none" dot={false}/>
                <Radar dataKey="compliance" stroke="#059669" fill="#059669" fillOpacity={0.12} strokeWidth={2} dot={{r:4,fill:"#9ca3af",stroke:"#fff",strokeWidth:2}}/>
                <RTooltip content={<RadarTooltipContent/>} wrapperStyle={{outline:"none"}}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Pending Actions */}
          <div style={{width:280,background:"#fff",borderRadius:16,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0",flexShrink:0,display:"flex",flexDirection:"column"}}>
            <h3 style={{margin:"0 0 14px",fontSize:13,fontWeight:700,color:"#374151",display:"flex",alignItems:"center",gap:6}}><AlertTriangle size={15} color="#dc2626"/> {t("pendingActions",lang)}</h3>
            <div style={{flex:1,overflow:"auto"}}>
              {actions.length===0 && <div style={{textAlign:"left",padding:20,color:"#9ca3af",fontSize:12}}>{t("noPendingActions",lang)}</div>}
              {actions.map((a,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 0",borderBottom:i<actions.length-1?"1px solid #f9fafb":"none"}}>
                  <StatusDot value={a.type==="alert"?30:a.type==="upload"?55:60}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,color:"#374151"}}>{a.action}</div>
                    <div style={{fontSize:10,color:"#9ca3af"}}>{a.domain}</div>
                  </div>
                  <span style={{fontSize:10,color:"#9ca3af",whiteSpace:"nowrap"}}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fellow Stewards */}
          <div style={{width:250,background:"#fff",borderRadius:16,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0",flexShrink:0,display:"flex",flexDirection:"column"}}>
            <h3 style={{margin:"0 0 14px",fontSize:13,fontWeight:700,color:"#374151",display:"flex",alignItems:"center",gap:6}}><Users size={15} color="#6366f1"/> {t("fellowStewards",lang)}</h3>
            <div style={{flex:1,overflow:"auto"}}>
              {stewards.map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:i<stewards.length-1?"1px solid #f9fafb":"none"}}>
                  <div style={{position:"relative"}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:"#eef2ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#6366f1"}}>{s.name[0]}</div>
                    <span style={{position:"absolute",bottom:0,right:0,width:7,height:7,borderRadius:"50%",border:"2px solid #fff",background:s.status==="online"?"#059669":s.status==="away"?"#d97706":"#d1d5db"}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,color:"#374151"}}>{s.name}</div>
                    <div style={{fontSize:10,color:"#9ca3af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls Table */}
        <div style={{background:"#fff",borderRadius:16,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0"}}>
          <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:700,color:"#374151"}}>{t("myAssignedControls",lang)} ({controls.length})</h3>
          <div style={{overflow:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:800}}>
              <thead><tr style={{borderBottom:"2px solid #f3f4f6"}}>
                {[t("control",lang),t("domain",lang),t("priority",lang),t("compliance",lang),t("workflow",lang),t("proposed",lang),t("comments",lang),t("evidence",lang),t("assigned",lang),""].map(h=>(
                  <th key={h} style={{textAlign:"left",padding:"8px 10px",color:"#6b7280",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {controls.map((c,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid #f9fafb",cursor:"pointer",background:c.workflow==="Ready for Review"?"#fafbff":"transparent"}}
                    onClick={()=>setSelCtrlIdx(i)}
                    onMouseEnter={e=>e.currentTarget.style.background=c.workflow==="Ready for Review"?"#eef2ff":"#f9fafb"}
                    onMouseLeave={e=>e.currentTarget.style.background=c.workflow==="Ready for Review"?"#fafbff":"transparent"}>
                    <td style={{padding:"12px 10px"}}><div style={{fontWeight:700,color:"#374151"}}>{c.cid}</div><div style={{fontSize:11,color:"#6b7280"}}>{c.cn}</div></td>
                    <td style={{padding:"12px 10px",fontSize:12,color:"#6b7280"}}>{c.domainName}</td>
                    <td style={{padding:"12px 10px"}}><span style={{padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700,background:c.priority==="P1"?"#fef2f2":c.priority==="P2"?"#fffbeb":"#f0fdf4",color:c.priority==="P1"?"#dc2626":c.priority==="P2"?"#d97706":"#059669"}}>{c.priority}</span></td>
                    <td style={{padding:"12px 10px"}}><StatusBadge status={c.status} lang={lang||"en"}/></td>
                    <td style={{padding:"12px 10px"}}><WorkflowBadge wf={c.workflow} lang={lang||"en"}/></td>
                    <td style={{padding:"12px 10px",fontSize:11,color:c.proposedStatus?STATUS_COLORS[c.proposedStatus]:"#9ca3af"}}>{c.proposedStatus||"—"}</td>
                    <td style={{padding:"12px 10px",fontSize:12,color:"#6b7280"}}><MessageSquare size={12} style={{marginRight:4}}/>{c.comments.length}</td>
                    <td style={{padding:"12px 10px",fontSize:12,color:"#6b7280"}}><FileText size={12} style={{marginRight:4}}/>{c.evidence.length}</td>
                    <td style={{padding:"12px 10px",fontSize:11,color:"#9ca3af"}}>{c.assignedDate}</td>
                    <td style={{padding:"12px 10px"}}><ChevronRight size={14} color="#9ca3af"/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AppFooter/>
    </div>
  );
}

// ═══ APP ROOT ═══
export default function App() {
  const [page,setPage] = useState("login");
  const [role,setRole] = useState(null);
  const [lang,setLang] = useState("en");
  const [allControls,setAllControls] = useState(() => {
    const init = {};
    ALL_SECTORS.forEach(s => { init[s.id] = generateControlsForSector(s.id); });
    return init;
  });

  const login = r => { setRole(r); setPage("dash"); };
  const logout = () => { setRole(null); setPage("login"); };

  const wrap = (child) => <div dir={lang==="ar"?"rtl":"ltr"} style={{fontFamily:lang==="ar"?"'Noto Sans Arabic','Segoe UI',sans-serif":"'DM Sans','Segoe UI',sans-serif",textAlign:"left"}}>{child}</div>;

  if (page==="login") return wrap(<LoginPage onLogin={login} lang={lang} setLang={setLang}/>);
  if (role==="admin") return wrap(<AdminDashboard onLogout={logout} allControls={allControls} setAllControls={setAllControls} lang={lang} setLang={setLang}/>);
  return wrap(<StewardDashboard onLogout={logout} allControls={allControls} setAllControls={setAllControls} lang={lang} setLang={setLang}/>);
}
