"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Position,
  BaseEdge,
  getSmoothStepPath,
  EdgeProps,
  Handle,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useLanguage } from "@/contexts/LanguageContext";

// Type definition for workflow node data
interface WorkflowNodeData {
  id: string;
  label: string;
  title: string;
  description: string;
  completed?: boolean;
  completedText?: string;
  disabled?: boolean;
  onToggle: (stepId: string, completed: boolean) => void;
}

// Type definition for workflow step from translations
interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  phase: number;
  parallel: number;
}

// Type definition for processed step with position
interface ProcessedStep extends WorkflowStep {
  position: { x: number; y: number };
}

// Custom animated edge component
function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <circle r="4" fill="#3b82f6" className="animate-pulse">
        <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  );
}

// Custom node component with checkbox
function WorkflowNode({ data }: { data: WorkflowNodeData }) {
  const [isCompleted, setIsCompleted] = useState(data.completed || false);

  // Sync local state with data.completed when it changes
  React.useEffect(() => {
    setIsCompleted(data.completed || false);
  }, [data.completed]);

  const handleToggle = () => {
    if (data.disabled) return;
    setIsCompleted(!isCompleted);
    if (data.onToggle) {
      data.onToggle(data.id, !isCompleted);
    }
  };

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg border-2 transition-all duration-300 ${
        isCompleted
          ? "bg-green-100 border-green-500 text-green-800"
          : data.disabled
          ? "bg-gray-100 border-gray-300 text-gray-400 opacity-60"
          : "bg-white border-gray-300 text-gray-800"
      }`}
    >
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleToggle}
          disabled={data.disabled}
          className={`w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ${
            data.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        />
        <div>
          <div className="font-semibold text-sm">{data.title}</div>
          <div className="text-xs opacity-75">{data.description}</div>
        </div>
      </div>
      {isCompleted && (
        <div className="mt-2 text-xs text-green-600">
          ✓ {data.completedText}
        </div>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

// Multilingual translations
const translations = {
  en: {
    progress: "Progress",
    completed: "Completed",
    helpText:
      "💡 Click the checkboxes to mark steps as completed. The animated dots show the flow progression.",
    workflows: {
      general: {
        title: "General Legal Process",
        steps: [
          {
            id: "1a",
            title: "Initial Client Meeting",
            description: "First consultation",
            phase: 1,
            parallel: 0,
          },
          {
            id: "1b",
            title: "Conflict Check",
            description: "Verify no conflicts",
            phase: 1,
            parallel: 1,
          },
          {
            id: "1c",
            title: "Legal Research",
            description: "Case law review",
            phase: 1,
            parallel: 2,
          },
          {
            id: "2a",
            title: "Sign Retainer Agreement",
            description: "Engagement contract",
            phase: 2,
            parallel: 0,
          },
          {
            id: "2b",
            title: "Collect Initial Payment",
            description: "Fee collection",
            phase: 2,
            parallel: 1,
          },
          {
            id: "3a",
            title: "Gather Documents",
            description: "Client documentation",
            phase: 3,
            parallel: 0,
          },
          {
            id: "3b",
            title: "Interview Witnesses",
            description: "Witness statements",
            phase: 3,
            parallel: 1,
          },
          {
            id: "3c",
            title: "Expert Consultation",
            description: "Specialist input",
            phase: 3,
            parallel: 2,
          },
          {
            id: "4",
            title: "Strategy Development",
            description: "Analyze legal options",
            phase: 4,
            parallel: 0,
          },
          {
            id: "5a",
            title: "Draft Pleadings",
            description: "Prepare documents",
            phase: 5,
            parallel: 0,
          },
          {
            id: "5b",
            title: "Prepare Exhibits",
            description: "Evidence compilation",
            phase: 5,
            parallel: 1,
          },
          {
            id: "6a",
            title: "File with Court",
            description: "Submit documents",
            phase: 6,
            parallel: 0,
          },
          {
            id: "6b",
            title: "Pay Filing Fees",
            description: "Court fees",
            phase: 6,
            parallel: 1,
          },
          {
            id: "7",
            title: "Discovery Process",
            description: "Exchange information",
            phase: 7,
            parallel: 0,
          },
          {
            id: "8",
            title: "Negotiation/Hearing",
            description: "Settlement or court",
            phase: 8,
            parallel: 0,
          },
          {
            id: "9",
            title: "Final Resolution",
            description: "Judgment/settlement",
            phase: 9,
            parallel: 0,
          },
        ],
      },
      divorce: {
        title: "Divorce Process",
        steps: [
          {
            id: "1a",
            title: "Gather Financial Documents",
            description: "Bank statements, tax returns",
            phase: 1,
            parallel: 0,
          },
          {
            id: "1b",
            title: "Document Asset Inventory",
            description: "List all properties",
            phase: 1,
            parallel: 1,
          },
          {
            id: "1c",
            title: "Consult Attorney",
            description: "Legal guidance",
            phase: 1,
            parallel: 2,
          },
          {
            id: "2a",
            title: "Draft Petition",
            description: "Prepare filing",
            phase: 2,
            parallel: 0,
          },
          {
            id: "2b",
            title: "File with Court",
            description: "Submit petition",
            phase: 2,
            parallel: 1,
          },
          {
            id: "2c",
            title: "Pay Filing Fees",
            description: "Court costs",
            phase: 2,
            parallel: 2,
          },
          {
            id: "3a",
            title: "Serve Spouse",
            description: "Legal notification",
            phase: 3,
            parallel: 0,
          },
          {
            id: "3b",
            title: "File Proof of Service",
            description: "Confirm delivery",
            phase: 3,
            parallel: 1,
          },
          {
            id: "4",
            title: "Wait for Response",
            description: "30-day period",
            phase: 4,
            parallel: 0,
          },
          {
            id: "5a",
            title: "Financial Disclosure",
            description: "Complete statements",
            phase: 5,
            parallel: 0,
          },
          {
            id: "5b",
            title: "Interrogatories",
            description: "Written questions",
            phase: 5,
            parallel: 1,
          },
          {
            id: "5c",
            title: "Depositions",
            description: "Sworn testimony",
            phase: 5,
            parallel: 2,
          },
          {
            id: "5d",
            title: "Property Appraisals",
            description: "Asset valuation",
            phase: 5,
            parallel: 3,
          },
          {
            id: "6a",
            title: "Custody Discussion",
            description: "Child arrangements",
            phase: 6,
            parallel: 0,
          },
          {
            id: "6b",
            title: "Asset Division",
            description: "Property split",
            phase: 6,
            parallel: 1,
          },
          {
            id: "6c",
            title: "Support Calculation",
            description: "Alimony/child support",
            phase: 6,
            parallel: 2,
          },
          {
            id: "7",
            title: "Mediation Session",
            description: "Settlement attempt",
            phase: 7,
            parallel: 0,
          },
          {
            id: "8a",
            title: "Final Decree Approval",
            description: "Judge review",
            phase: 8,
            parallel: 0,
          },
          {
            id: "8b",
            title: "Submit to Judge",
            description: "Final submission",
            phase: 8,
            parallel: 1,
          },
        ],
      },
      contract: {
        title: "Contract Dispute Process",
        steps: [
          {
            id: "1a",
            title: "Review Contract Terms",
            description: "Analyze agreement",
            phase: 1,
            parallel: 0,
          },
          {
            id: "1b",
            title: "Document Breach Evidence",
            description: "Gather proof",
            phase: 1,
            parallel: 1,
          },
          {
            id: "1c",
            title: "Calculate Damages",
            description: "Financial impact",
            phase: 1,
            parallel: 2,
          },
          {
            id: "1d",
            title: "Check Statute of Limitations",
            description: "Verify deadline",
            phase: 1,
            parallel: 3,
          },
          {
            id: "2a",
            title: "Draft Demand Letter",
            description: "Formal notice",
            phase: 2,
            parallel: 0,
          },
          {
            id: "2b",
            title: "Send via Certified Mail",
            description: "Proof of delivery",
            phase: 2,
            parallel: 1,
          },
          {
            id: "3",
            title: "Wait for Response",
            description: "30-day period",
            phase: 3,
            parallel: 0,
          },
          {
            id: "4a",
            title: "Propose Mediation",
            description: "Settlement offer",
            phase: 4,
            parallel: 0,
          },
          {
            id: "4b",
            title: "Select Mediator",
            description: "Neutral third party",
            phase: 4,
            parallel: 1,
          },
          {
            id: "4c",
            title: "Attend Mediation",
            description: "Negotiation session",
            phase: 4,
            parallel: 2,
          },
          {
            id: "5a",
            title: "Draft Complaint",
            description: "Lawsuit preparation",
            phase: 5,
            parallel: 0,
          },
          {
            id: "5b",
            title: "Gather Witness List",
            description: "Identify witnesses",
            phase: 5,
            parallel: 1,
          },
          {
            id: "5c",
            title: "Organize Evidence",
            description: "Build case file",
            phase: 5,
            parallel: 2,
          },
          {
            id: "6a",
            title: "Document Requests",
            description: "Discovery demands",
            phase: 6,
            parallel: 0,
          },
          {
            id: "6b",
            title: "Interrogatories",
            description: "Written questions",
            phase: 6,
            parallel: 1,
          },
          {
            id: "6c",
            title: "Depositions",
            description: "Witness testimony",
            phase: 6,
            parallel: 2,
          },
          {
            id: "7a",
            title: "Settlement Conference",
            description: "Pre-trial negotiation",
            phase: 7,
            parallel: 0,
          },
          {
            id: "7b",
            title: "Trial Preparation",
            description: "Court readiness",
            phase: 7,
            parallel: 1,
          },
          {
            id: "8",
            title: "Trial or Settlement",
            description: "Final resolution",
            phase: 8,
            parallel: 0,
          },
        ],
      },
    },
  },
  hi: {
    progress: "प्रगति",
    completed: "पूर्ण",
    helpText:
      "💡 चरणों को पूर्ण के रूप में चिह्नित करने के लिए चेकबॉक्स पर क्लिक करें। एनिमेटेड डॉट्स प्रवाह की प्रगति दिखाते हैं।",
    workflows: {
      general: {
        title: "सामान्य कानूनी प्रक्रिया",
        steps: [
          {
            id: "1a",
            title: "प्रारंभिक बैठक",
            description: "पहली परामर्श",
            phase: 1,
            parallel: 0,
          },
          {
            id: "1b",
            title: "संघर्ष जांच",
            description: "कोई संघर्ष नहीं सत्यापित करें",
            phase: 1,
            parallel: 1,
          },
          {
            id: "1c",
            title: "कानूनी अनुसंधान",
            description: "केस कानून समीक्षा",
            phase: 1,
            parallel: 2,
          },
          {
            id: "2a",
            title: "रिटेनर समझौते पर हस्ताक्षर",
            description: "अनुबंध",
            phase: 2,
            parallel: 0,
          },
          {
            id: "2b",
            title: "प्रारंभिक भुगतान एकत्र करें",
            description: "शुल्क संग्रह",
            phase: 2,
            parallel: 1,
          },
          {
            id: "3a",
            title: "दस्तावेज़ एकत्र करें",
            description: "क्लाइंट प्रलेखन",
            phase: 3,
            parallel: 0,
          },
          {
            id: "3b",
            title: "गवाहों का साक्षात्कार",
            description: "गवाह बयान",
            phase: 3,
            parallel: 1,
          },
          {
            id: "3c",
            title: "विशेषज्ञ परामर्श",
            description: "विशेषज्ञ इनपुट",
            phase: 3,
            parallel: 2,
          },
          {
            id: "4",
            title: "रणनीति विकास",
            description: "कानूनी विकल्पों का विश्लेषण",
            phase: 4,
            parallel: 0,
          },
          {
            id: "5a",
            title: "दलीलें तैयार करें",
            description: "दस्तावेज़ तैयार करें",
            phase: 5,
            parallel: 0,
          },
          {
            id: "5b",
            title: "प्रदर्शनी तैयार करें",
            description: "साक्ष्य संकलन",
            phase: 5,
            parallel: 1,
          },
          {
            id: "6a",
            title: "कोर्ट में फाइल करें",
            description: "दस्तावेज़ जमा करें",
            phase: 6,
            parallel: 0,
          },
          {
            id: "6b",
            title: "फाइलिंग शुल्क का भुगतान",
            description: "कोर्ट शुल्क",
            phase: 6,
            parallel: 1,
          },
          {
            id: "7",
            title: "खोज प्रक्रिया",
            description: "जानकारी का आदान-प्रदान",
            phase: 7,
            parallel: 0,
          },
          {
            id: "8",
            title: "बातचीत/सुनवाई",
            description: "समझौता या कोर्ट",
            phase: 8,
            parallel: 0,
          },
          {
            id: "9",
            title: "अंतिम समाधान",
            description: "निर्णय/समझौता",
            phase: 9,
            parallel: 0,
          },
        ],
      },
      divorce: {
        title: "तलाक की प्रक्रिया",
        steps: [
          {
            id: "1a",
            title: "वित्तीय दस्तावेज़ एकत्र करें",
            description: "बैंक विवरण, कर रिटर्न",
            phase: 1,
            parallel: 0,
          },
          {
            id: "1b",
            title: "संपत्ति सूची दस्तावेज़",
            description: "सभी संपत्तियों की सूची",
            phase: 1,
            parallel: 1,
          },
          {
            id: "1c",
            title: "वकील से परामर्श",
            description: "कानूनी मार्गदर्शन",
            phase: 1,
            parallel: 2,
          },
          {
            id: "2a",
            title: "याचिका का मसौदा",
            description: "फाइलिंग तैयार करें",
            phase: 2,
            parallel: 0,
          },
          {
            id: "2b",
            title: "कोर्ट में फाइल करें",
            description: "याचिका जमा करें",
            phase: 2,
            parallel: 1,
          },
          {
            id: "2c",
            title: "फाइलिंग शुल्क का भुगतान",
            description: "कोर्ट लागत",
            phase: 2,
            parallel: 2,
          },
          {
            id: "3a",
            title: "पति/पत्नी को सेवा दें",
            description: "कानूनी अधिसूचना",
            phase: 3,
            parallel: 0,
          },
          {
            id: "3b",
            title: "सेवा का प्रमाण दाखिल करें",
            description: "डिलीवरी की पुष्टि",
            phase: 3,
            parallel: 1,
          },
          {
            id: "4",
            title: "प्रतिक्रिया की प्रतीक्षा",
            description: "30-दिन की अवधि",
            phase: 4,
            parallel: 0,
          },
          {
            id: "5a",
            title: "वित्तीय प्रकटीकरण",
            description: "पूर्ण विवरण",
            phase: 5,
            parallel: 0,
          },
          {
            id: "5b",
            title: "पूछताछ",
            description: "लिखित प्रश्न",
            phase: 5,
            parallel: 1,
          },
          {
            id: "5c",
            title: "जमा",
            description: "शपथ ग्रहण गवाही",
            phase: 5,
            parallel: 2,
          },
          {
            id: "5d",
            title: "संपत्ति मूल्यांकन",
            description: "संपत्ति मूल्यांकन",
            phase: 5,
            parallel: 3,
          },
          {
            id: "6a",
            title: "हिरासत चर्चा",
            description: "बच्चे की व्यवस्था",
            phase: 6,
            parallel: 0,
          },
          {
            id: "6b",
            title: "संपत्ति विभाजन",
            description: "संपत्ति विभाजन",
            phase: 6,
            parallel: 1,
          },
          {
            id: "6c",
            title: "समर्थन गणना",
            description: "गुजारा भत्ता/बाल समर्थन",
            phase: 6,
            parallel: 2,
          },
          {
            id: "7",
            title: "मध्यस्थता सत्र",
            description: "समझौता प्रयास",
            phase: 7,
            parallel: 0,
          },
          {
            id: "8a",
            title: "अंतिम डिक्री अनुमोदन",
            description: "न्यायाधीश समीक्षा",
            phase: 8,
            parallel: 0,
          },
          {
            id: "8b",
            title: "न्यायाधीश को जमा करें",
            description: "अंतिम प्रस्तुति",
            phase: 8,
            parallel: 1,
          },
        ],
      },
      contract: {
        title: "अनुबंध विवाद प्रक्रिया",
        steps: [
          {
            id: "1a",
            title: "अनुबंध शर्तों की समीक्षा",
            description: "समझौते का विश्लेषण",
            phase: 1,
            parallel: 0,
          },
          {
            id: "1b",
            title: "उल्लंघन साक्ष्य दस्तावेज़",
            description: "प्रमाण इकट्ठा करें",
            phase: 1,
            parallel: 1,
          },
          {
            id: "1c",
            title: "नुकसान की गणना",
            description: "वित्तीय प्रभाव",
            phase: 1,
            parallel: 2,
          },
          {
            id: "1d",
            title: "सीमा क़ानून की जाँच करें",
            description: "समय सीमा सत्यापित करें",
            phase: 1,
            parallel: 3,
          },
          {
            id: "2a",
            title: "मांग पत्र का मसौदा",
            description: "औपचारिक नोटिस",
            phase: 2,
            parallel: 0,
          },
          {
            id: "2b",
            title: "प्रमाणित मेल के माध्यम से भेजें",
            description: "डिलीवरी का सबूत",
            phase: 2,
            parallel: 1,
          },
          {
            id: "3",
            title: "प्रतिक्रिया की प्रतीक्षा",
            description: "30-दिन की अवधि",
            phase: 3,
            parallel: 0,
          },
          {
            id: "4a",
            title: "मध्यस्थता का प्रस्ताव",
            description: "समझौता प्रस्ताव",
            phase: 4,
            parallel: 0,
          },
          {
            id: "4b",
            title: "मध्यस्थ का चयन करें",
            description: "तटस्थ तीसरा पक्ष",
            phase: 4,
            parallel: 1,
          },
          {
            id: "4c",
            title: "मध्यस्थता में भाग लें",
            description: "बातचीत सत्र",
            phase: 4,
            parallel: 2,
          },
          {
            id: "5a",
            title: "शिकायत का मसौदा",
            description: "मुकदमे की तैयारी",
            phase: 5,
            parallel: 0,
          },
          {
            id: "5b",
            title: "गवाह सूची इकट्ठा करें",
            description: "गवाहों की पहचान",
            phase: 5,
            parallel: 1,
          },
          {
            id: "5c",
            title: "साक्ष्य व्यवस्थित करें",
            description: "केस फाइल बनाएं",
            phase: 5,
            parallel: 2,
          },
          {
            id: "6a",
            title: "दस्तावेज़ अनुरोध",
            description: "खोज मांग",
            phase: 6,
            parallel: 0,
          },
          {
            id: "6b",
            title: "पूछताछ",
            description: "लिखित प्रश्न",
            phase: 6,
            parallel: 1,
          },
          {
            id: "6c",
            title: "जमा",
            description: "गवाह गवाही",
            phase: 6,
            parallel: 2,
          },
          {
            id: "7a",
            title: "समझौता सम्मेलन",
            description: "पूर्व-परीक्षण वार्ता",
            phase: 7,
            parallel: 0,
          },
          {
            id: "7b",
            title: "परीक्षण की तैयारी",
            description: "कोर्ट तैयारी",
            phase: 7,
            parallel: 1,
          },
          {
            id: "8",
            title: "परीक्षण या समझौता",
            description: "अंतिम समाधान",
            phase: 8,
            parallel: 0,
          },
        ],
      },
    },
  },
  mr: {
    progress: "प्रगती",
    completed: "पूर्ण",
    helpText:
      "💡 पायऱ्या पूर्ण म्हणून चिन्हांकित करण्यासाठी चेकबॉक्सवर क्लिक करा. अॅनिमेटेड डॉट्स प्रवाहाची प्रगती दर्शवतात.",
    workflows: {
      general: {
        title: "सामान्य कायदेशीर प्रक्रिया",
        steps: [
          {
            id: "1a",
            title: "प्रारंभिक बैठक",
            description: "पहिली सल्लामसलत",
            phase: 1,
            parallel: 0,
          },
          {
            id: "1b",
            title: "संघर्ष तपासणी",
            description: "कोणताही संघर्ष नाही सत्यापित करा",
            phase: 1,
            parallel: 1,
          },
          {
            id: "1c",
            title: "कायदेशीर संशोधन",
            description: "केस कायदा पुनरावलोकन",
            phase: 1,
            parallel: 2,
          },
          {
            id: "2a",
            title: "रिटेनर करारावर स्वाक्षरी",
            description: "करार",
            phase: 2,
            parallel: 0,
          },
          {
            id: "2b",
            title: "प्रारंभिक पेमेंट गोळा करा",
            description: "शुल्क संकलन",
            phase: 2,
            parallel: 1,
          },
          {
            id: "3a",
            title: "कागदपत्रे गोळा करा",
            description: "क्लायंट प्रलेखन",
            phase: 3,
            parallel: 0,
          },
          {
            id: "3b",
            title: "साक्षीदारांची मुलाखत",
            description: "साक्षीदार विधान",
            phase: 3,
            parallel: 1,
          },
          {
            id: "3c",
            title: "तज्ञ सल्लामसलत",
            description: "तज्ञ इनपुट",
            phase: 3,
            parallel: 2,
          },
          {
            id: "4",
            title: "धोरण विकास",
            description: "कायदेशीर पर्यायांचे विश्लेषण",
            phase: 4,
            parallel: 0,
          },
          {
            id: "5a",
            title: "विनंत्या तयार करा",
            description: "कागदपत्रे तयार करा",
            phase: 5,
            parallel: 0,
          },
          {
            id: "5b",
            title: "प्रदर्शने तयार करा",
            description: "पुरावा संकलन",
            phase: 5,
            parallel: 1,
          },
          {
            id: "6a",
            title: "न्यायालयात फाइल करा",
            description: "कागदपत्रे सादर करा",
            phase: 6,
            parallel: 0,
          },
          {
            id: "6b",
            title: "फाइलिंग फी भरा",
            description: "न्यायालय शुल्क",
            phase: 6,
            parallel: 1,
          },
          {
            id: "7",
            title: "शोध प्रक्रिया",
            description: "माहिती देवाणघेवाण",
            phase: 7,
            parallel: 0,
          },
          {
            id: "8",
            title: "वाटाघाटी/सुनावणी",
            description: "तोडगा किंवा न्यायालय",
            phase: 8,
            parallel: 0,
          },
          {
            id: "9",
            title: "अंतिम निराकरण",
            description: "निर्णय/तोडगा",
            phase: 9,
            parallel: 0,
          },
        ],
      },
      divorce: {
        title: "घटस्फोट प्रक्रिया",
        steps: [
          {
            id: "1a",
            title: "आर्थिक कागदपत्रे गोळा करा",
            description: "बँक विवरण, कर रिटर्न",
            phase: 1,
            parallel: 0,
          },
          {
            id: "1b",
            title: "मालमत्ता यादी दस्तऐवज",
            description: "सर्व मालमत्तेची यादी",
            phase: 1,
            parallel: 1,
          },
          {
            id: "1c",
            title: "वकीलाशी सल्लामसलत",
            description: "कायदेशीर मार्गदर्शन",
            phase: 1,
            parallel: 2,
          },
          {
            id: "2a",
            title: "याचिकेचा मसुदा",
            description: "फाइलिंग तयार करा",
            phase: 2,
            parallel: 0,
          },
          {
            id: "2b",
            title: "न्यायालयात फाइल करा",
            description: "याचिका सादर करा",
            phase: 2,
            parallel: 1,
          },
          {
            id: "2c",
            title: "फाइलिंग फी भरा",
            description: "न्यायालय खर्च",
            phase: 2,
            parallel: 2,
          },
          {
            id: "3a",
            title: "जोडीदाराला सेवा द्या",
            description: "कायदेशीर अधिसूचना",
            phase: 3,
            parallel: 0,
          },
          {
            id: "3b",
            title: "सेवेचा पुरावा दाखल करा",
            description: "वितरण पुष्टी",
            phase: 3,
            parallel: 1,
          },
          {
            id: "4",
            title: "प्रतिसादाची प्रतीक्षा",
            description: "30-दिवसांचा कालावधी",
            phase: 4,
            parallel: 0,
          },
          {
            id: "5a",
            title: "आर्थिक प्रकटीकरण",
            description: "संपूर्ण विवरण",
            phase: 5,
            parallel: 0,
          },
          {
            id: "5b",
            title: "चौकशी",
            description: "लेखी प्रश्न",
            phase: 5,
            parallel: 1,
          },
          {
            id: "5c",
            title: "जमा",
            description: "शपथपत्र साक्ष",
            phase: 5,
            parallel: 2,
          },
          {
            id: "5d",
            title: "मालमत्ता मूल्यमापन",
            description: "मालमत्ता मूल्यांकन",
            phase: 5,
            parallel: 3,
          },
          {
            id: "6a",
            title: "ताब्यात चर्चा",
            description: "मुलाची व्यवस्था",
            phase: 6,
            parallel: 0,
          },
          {
            id: "6b",
            title: "मालमत्ता विभाजन",
            description: "मालमत्ता विभाजन",
            phase: 6,
            parallel: 1,
          },
          {
            id: "6c",
            title: "समर्थन गणना",
            description: "पोटगी/बाल समर्थन",
            phase: 6,
            parallel: 2,
          },
          {
            id: "7",
            title: "मध्यस्थी सत्र",
            description: "तोडगा प्रयत्न",
            phase: 7,
            parallel: 0,
          },
          {
            id: "8a",
            title: "अंतिम हुकूम मंजूरी",
            description: "न्यायाधीश पुनरावलोकन",
            phase: 8,
            parallel: 0,
          },
          {
            id: "8b",
            title: "न्यायाधीशाकडे सादर करा",
            description: "अंतिम सादरीकरण",
            phase: 8,
            parallel: 1,
          },
        ],
      },
      contract: {
        title: "करार विवाद प्रक्रिया",
        steps: [
          {
            id: "1a",
            title: "करार अटींचे पुनरावलोकन",
            description: "कराराचे विश्लेषण",
            phase: 1,
            parallel: 0,
          },
          {
            id: "1b",
            title: "उल्लंघन पुरावा दस्तऐवज",
            description: "पुरावा गोळा करा",
            phase: 1,
            parallel: 1,
          },
          {
            id: "1c",
            title: "नुकसानीची गणना",
            description: "आर्थिक प्रभाव",
            phase: 1,
            parallel: 2,
          },
          {
            id: "1d",
            title: "मर्यादा कायदा तपासा",
            description: "मुदत सत्यापित करा",
            phase: 1,
            parallel: 3,
          },
          {
            id: "2a",
            title: "मागणी पत्राचा मसुदा",
            description: "औपचारिक सूचना",
            phase: 2,
            parallel: 0,
          },
          {
            id: "2b",
            title: "प्रमाणित मेलद्वारे पाठवा",
            description: "वितरणाचा पुरावा",
            phase: 2,
            parallel: 1,
          },
          {
            id: "3",
            title: "प्रतिसादाची प्रतीक्षा",
            description: "30-दिवसांचा कालावधी",
            phase: 3,
            parallel: 0,
          },
          {
            id: "4a",
            title: "मध्यस्थीचा प्रस्ताव",
            description: "तोडगा ऑफर",
            phase: 4,
            parallel: 0,
          },
          {
            id: "4b",
            title: "मध्यस्थ निवडा",
            description: "तटस्थ तृतीय पक्ष",
            phase: 4,
            parallel: 1,
          },
          {
            id: "4c",
            title: "मध्यस्थीत सहभागी व्हा",
            description: "वाटाघाटी सत्र",
            phase: 4,
            parallel: 2,
          },
          {
            id: "5a",
            title: "तक्रारीचा मसुदा",
            description: "खटल्याची तयारी",
            phase: 5,
            parallel: 0,
          },
          {
            id: "5b",
            title: "साक्षीदार यादी गोळा करा",
            description: "साक्षीदारांची ओळख",
            phase: 5,
            parallel: 1,
          },
          {
            id: "5c",
            title: "पुरावा व्यवस्थित करा",
            description: "केस फाइल तयार करा",
            phase: 5,
            parallel: 2,
          },
          {
            id: "6a",
            title: "दस्तऐवज विनंत्या",
            description: "शोध मागणी",
            phase: 6,
            parallel: 0,
          },
          {
            id: "6b",
            title: "चौकशी",
            description: "लेखी प्रश्न",
            phase: 6,
            parallel: 1,
          },
          {
            id: "6c",
            title: "जमा",
            description: "साक्षीदार साक्ष",
            phase: 6,
            parallel: 2,
          },
          {
            id: "7a",
            title: "तोडगा परिषद",
            description: "पूर्व-चाचणी वाटाघाटी",
            phase: 7,
            parallel: 0,
          },
          {
            id: "7b",
            title: "चाचणी तयारी",
            description: "न्यायालय तयारी",
            phase: 7,
            parallel: 1,
          },
          {
            id: "8",
            title: "चाचणी किंवा तोडगा",
            description: "अंतिम निराकरण",
            phase: 8,
            parallel: 0,
          },
        ],
      },
    },
  },
};

interface WorkflowDiagramProps {
  processType?: string;
}

const nodeTypes = {
  workflow: WorkflowNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
};

export default function WorkflowDiagram({
  processType = "general",
}: WorkflowDiagramProps) {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  // Define different workflow processes with translations and positioning
  const workflows = useMemo(() => {
    const calculatePosition = (
      phase: number,
      parallel: number,
      totalParallel: number
    ) => {
      const phaseSpacing = 250;
      const parallelSpacing = 100;
      const baseY = 50;

      // Calculate vertical offset to center parallel nodes
      const verticalOffset =
        totalParallel > 1 ? ((totalParallel - 1) * parallelSpacing) / 2 : 0;

      return {
        x: phase * phaseSpacing,
        y: baseY + parallel * parallelSpacing - verticalOffset,
      };
    };

    const processWorkflow = (steps: WorkflowStep[]) => {
      // Group steps by phase to calculate total parallel nodes
      const phaseGroups = steps.reduce((acc, step) => {
        if (!acc[step.phase]) acc[step.phase] = [];
        acc[step.phase].push(step);
        return acc;
      }, {} as Record<number, WorkflowStep[]>);

      return steps.map((step) => {
        const totalParallelInPhase = phaseGroups[step.phase].length;
        return {
          id: step.id,
          title: step.title,
          description: step.description,
          phase: step.phase,
          parallel: step.parallel,
          position: calculatePosition(
            step.phase,
            step.parallel,
            totalParallelInPhase
          ),
        };
      });
    };

    return {
      general: {
        title: t.workflows.general.title,
        steps: processWorkflow(t.workflows.general.steps),
      },
      divorce: {
        title: t.workflows.divorce.title,
        steps: processWorkflow(t.workflows.divorce.steps),
      },
      contract: {
        title: t.workflows.contract.title,
        steps: processWorkflow(t.workflows.contract.steps),
      },
    };
  }, [t.workflows]);

  const currentWorkflow =
    workflows[processType as keyof typeof workflows] || workflows.general;

  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Helper function to check if all nodes in a phase are completed
  const isPhaseCompleted = useCallback(
    (phase: number, steps: ProcessedStep[]) => {
      const phaseSteps = steps.filter((step) => step.phase === phase);
      return phaseSteps.every((step) => completedSteps.has(step.id));
    },
    [completedSteps]
  );

  // Helper function to check if a node should be disabled
  const isNodeDisabled = useCallback(
    (nodePhase: number, steps: ProcessedStep[]) => {
      // Phase 1 is never disabled
      if (nodePhase === 1) return false;
      // Check if all previous phases are completed
      for (let phase = 1; phase < nodePhase; phase++) {
        if (!isPhaseCompleted(phase, steps)) {
          return true;
        }
      }
      return false;
    },
    [isPhaseCompleted]
  );

  const handleStepToggle = useCallback((stepId: string, completed: boolean) => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      if (completed) {
        newSet.add(stepId);
      } else {
        newSet.delete(stepId);
      }
      return newSet;
    });
  }, []);

  const initialNodes: Node[] = useMemo(
    () =>
      currentWorkflow.steps.map((step) => ({
        id: step.id,
        type: "workflow",
        position: step.position,
        data: {
          id: step.id,
          title: step.title,
          description: step.description,
          completed: completedSteps.has(step.id),
          disabled: isNodeDisabled(step.phase, currentWorkflow.steps),
          onToggle: handleStepToggle,
          completedText: t.completed,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      })),
    [
      currentWorkflow.steps,
      completedSteps,
      isNodeDisabled,
      handleStepToggle,
      t.completed,
    ]
  );

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    const steps = currentWorkflow.steps;

    // Group steps by phase
    const phaseGroups = steps.reduce((acc, step) => {
      if (!acc[step.phase]) acc[step.phase] = [];
      acc[step.phase].push(step);
      return acc;
    }, {} as Record<number, ProcessedStep[]>);

    const phases = Object.keys(phaseGroups)
      .map(Number)
      .sort((a, b) => a - b);

    // Connect nodes between phases
    for (let i = 0; i < phases.length - 1; i++) {
      const currentPhase = phases[i];
      const nextPhase = phases[i + 1];
      const currentNodes = phaseGroups[currentPhase];
      const nextNodes = phaseGroups[nextPhase];

      // Connect each node in current phase to all nodes in next phase
      currentNodes.forEach((currentNode) => {
        nextNodes.forEach((nextNode) => {
          const isSourceCompleted = completedSteps.has(currentNode.id);
          edges.push({
            id: `e${currentNode.id}-${nextNode.id}`,
            source: currentNode.id,
            target: nextNode.id,
            type: "smoothstep",
            animated: isSourceCompleted,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: isSourceCompleted ? "#3b82f6" : "#d1d5db",
            },
            style: {
              stroke: isSourceCompleted ? "#3b82f6" : "#d1d5db",
              strokeWidth: 2,
            },
          });
        });
      });
    }

    return edges;
  }, [currentWorkflow.steps, completedSteps]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update workflow when language or processType changes
  React.useEffect(() => {
    const newWorkflow =
      workflows[processType as keyof typeof workflows] || workflows.general;

    // Update nodes
    const newNodes = newWorkflow.steps.map((step) => ({
      id: step.id,
      type: "workflow",
      position: step.position,
      data: {
        id: step.id,
        title: step.title,
        description: step.description,
        completed: completedSteps.has(step.id),
        disabled: isNodeDisabled(step.phase, newWorkflow.steps),
        onToggle: handleStepToggle,
        completedText: t.completed,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));
    setNodes(newNodes);

    // Update edges
    const newEdges: Edge[] = [];
    const steps = newWorkflow.steps;

    // Group steps by phase
    const phaseGroups = steps.reduce((acc, step) => {
      if (!acc[step.phase]) acc[step.phase] = [];
      acc[step.phase].push(step);
      return acc;
    }, {} as Record<number, ProcessedStep[]>);

    const phases = Object.keys(phaseGroups)
      .map(Number)
      .sort((a, b) => a - b);

    // Connect nodes between phases
    for (let i = 0; i < phases.length - 1; i++) {
      const currentPhase = phases[i];
      const nextPhase = phases[i + 1];
      const currentNodes = phaseGroups[currentPhase];
      const nextNodes = phaseGroups[nextPhase];

      // Connect each node in current phase to all nodes in next phase
      currentNodes.forEach((currentNode) => {
        nextNodes.forEach((nextNode) => {
          const isSourceCompleted = completedSteps.has(currentNode.id);
          newEdges.push({
            id: `e${currentNode.id}-${nextNode.id}`,
            source: currentNode.id,
            target: nextNode.id,
            type: "smoothstep",
            animated: isSourceCompleted,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: isSourceCompleted ? "#3b82f6" : "#d1d5db",
            },
            style: {
              stroke: isSourceCompleted ? "#3b82f6" : "#d1d5db",
              strokeWidth: 2,
            },
          });
        });
      });
    }

    setEdges(newEdges);
  }, [
    currentLanguage,
    processType,
    completedSteps,
    workflows,
    handleStepToggle,
    t.completed,
    setNodes,
    setEdges,
    isNodeDisabled,
  ]);

  // Update nodes when completedSteps or language changes
  React.useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        const step = currentWorkflow.steps.find((s) => s.id === node.id);
        if (!step) return node;

        // Count total number of completed phases
        const maxPhase = Math.max(...currentWorkflow.steps.map((s) => s.phase));
        let totalCompletedPhases = 0;
        for (let phase = 1; phase <= maxPhase; phase++) {
          if (isPhaseCompleted(phase, currentWorkflow.steps)) {
            totalCompletedPhases++;
          }
        }

        // Move completed phases AND the immediate next phase together
        // If this node's phase is completed OR it's the next phase after completed ones
        const isNextPhaseAfterCompleted =
          step.phase <= totalCompletedPhases + 1;
        const xOffset = isNextPhaseAfterCompleted
          ? -totalCompletedPhases * 180
          : 0;

        return {
          ...node,
          position: {
            x: step.position.x + xOffset,
            y: step.position.y,
          },
          data: {
            ...node.data,
            completed: completedSteps.has(node.id),
            disabled: isNodeDisabled(step.phase, currentWorkflow.steps),
            completedText: t.completed,
          },
        };
      })
    );
  }, [
    completedSteps,
    currentWorkflow.steps,
    isNodeDisabled,
    isPhaseCompleted,
    setNodes,
    t.completed,
  ]);

  // Update edges when completedSteps changes
  React.useEffect(() => {
    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        const isSourceCompleted = completedSteps.has(edge.source);
        return {
          ...edge,
          animated: isSourceCompleted,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: isSourceCompleted ? "#3b82f6" : "#d1d5db",
          },
          style: {
            stroke: isSourceCompleted ? "#3b82f6" : "#d1d5db",
            strokeWidth: 2,
          },
        };
      })
    );
  }, [completedSteps, setEdges]);

  const progressPercentage =
    (completedSteps.size / currentWorkflow.steps.length) * 100;

  return (
    <div className="border-2 border-gray-300 rounded-lg bg-gray-50 p-4 mt-4">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          {currentWorkflow.title}
        </h3>
        <div className="flex items-center space-x-2 mt-2">
          <div className="text-sm text-gray-600">{t.progress}:</div>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-sm font-semibold text-gray-700">
            {completedSteps.size}/{currentWorkflow.steps.length}
          </div>
        </div>
      </div>

      <div style={{ height: "700px", width: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultViewport={{ x: 100, y: 50, zoom: 1 }}
          minZoom={0.5}
          maxZoom={2}
        >
          <Background color="#f3f4f6" gap={20} />
          <Controls />
        </ReactFlow>
      </div>

      <div className="mt-4 text-xs text-gray-500">{t.helpText}</div>
    </div>
  );
}
