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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useLanguage, Language } from "@/contexts/LanguageContext";

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
function WorkflowNode({ data }: { data: any }) {
  const [isCompleted, setIsCompleted] = useState(data.completed || false);

  const handleToggle = () => {
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
          : "bg-white border-gray-300 text-gray-800"
      }`}
    >
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleToggle}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
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
          { title: "Initial Consultation", description: "Meet with attorney" },
          { title: "Case Assessment", description: "Evaluate legal options" },
          {
            title: "Document Preparation",
            description: "Gather required documents",
          },
          {
            title: "Filing/Submission",
            description: "Submit to court/authority",
          },
          { title: "Resolution", description: "Complete legal process" },
        ],
      },
      divorce: {
        title: "Divorce Process",
        steps: [
          { title: "File Petition", description: "Submit divorce papers" },
          { title: "Serve Spouse", description: "Legal notification" },
          { title: "Response Period", description: "Wait for spouse response" },
          {
            title: "Discovery/Negotiation",
            description: "Asset division discussion",
          },
          { title: "Final Decree", description: "Court approval" },
        ],
      },
      contract: {
        title: "Contract Dispute Process",
        steps: [
          { title: "Review Contract", description: "Analyze terms & breach" },
          {
            title: "Demand Letter",
            description: "Formal notice to other party",
          },
          { title: "Mediation", description: "Attempt to resolve" },
          { title: "Litigation", description: "File lawsuit if needed" },
          { title: "Judgment/Settlement", description: "Final resolution" },
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
          { title: "प्रारंभिक परामर्श", description: "वकील से मिलें" },
          {
            title: "केस मूल्यांकन",
            description: "कानूनी विकल्पों का मूल्यांकन करें",
          },
          {
            title: "दस्तावेज़ तैयारी",
            description: "आवश्यक दस्तावेज़ एकत्र करें",
          },
          {
            title: "फ़ाइलिंग/सबमिशन",
            description: "कोर्ट/प्राधिकरण में जमा करें",
          },
          { title: "समाधान", description: "कानूनी प्रक्रिया पूर्ण करें" },
        ],
      },
      divorce: {
        title: "तलाक की प्रक्रिया",
        steps: [
          {
            title: "याचिका दायर करें",
            description: "तलाक के कागज़ात जमा करें",
          },
          { title: "पति/पत्नी को सूचना दें", description: "कानूनी अधिसूचना" },
          {
            title: "प्रतिक्रिया अवधि",
            description: "पति/पत्नी की प्रतिक्रिया की प्रतीक्षा करें",
          },
          { title: "खोज/बातचीत", description: "संपत्ति विभाजन चर्चा" },
          { title: "अंतिम डिक्री", description: "कोर्ट की मंजूरी" },
        ],
      },
      contract: {
        title: "अनुबंध विवाद प्रक्रिया",
        steps: [
          {
            title: "अनुबंध समीक्षा",
            description: "शर्तों और उल्लंघन का विश्लेषण",
          },
          { title: "मांग पत्र", description: "दूसरे पक्ष को औपचारिक नोटिस" },
          { title: "मध्यस्थता", description: "समाधान का प्रयास" },
          {
            title: "मुकदमेबाजी",
            description: "आवश्यक होने पर मुकदमा दायर करें",
          },
          { title: "न्यायाधीश/समझौता", description: "अंतिम समाधान" },
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
          { title: "प्रारंभिक सल्लामसलत", description: "वकीलाशी भेट" },
          {
            title: "केस मूल्यांकन",
            description: "कायदेशीर पर्यायांचे मूल्यांकन",
          },
          { title: "कागदपत्र तयारी", description: "आवश्यक कागदपत्रे गोळा करा" },
          {
            title: "फाइलिंग/सबमिशन",
            description: "न्यायालय/प्राधिकरणात सादर करा",
          },
          { title: "निराकरण", description: "कायदेशीर प्रक्रिया पूर्ण करा" },
        ],
      },
      divorce: {
        title: "घटस्फोट प्रक्रिया",
        steps: [
          {
            title: "याचिका दाखल करा",
            description: "घटस्फोटाची कागदपत्रे सादर करा",
          },
          { title: "जोडीदाराला सूचना द्या", description: "कायदेशीर अधिसूचना" },
          {
            title: "प्रतिसाद कालावधी",
            description: "जोडीदाराच्या प्रतिसादाची प्रतीक्षा",
          },
          { title: "शोध/वाटाघाटी", description: "मालमत्ता विभाजन चर्चा" },
          { title: "अंतिम हुकूमनामा", description: "न्यायालयाची मंजूरी" },
        ],
      },
      contract: {
        title: "करार विवाद प्रक्रिया",
        steps: [
          {
            title: "करार पुनरावलोकन",
            description: "अटी आणि उल्लंघनाचे विश्लेषण",
          },
          { title: "मागणी पत्र", description: "दुसऱ्या पक्षाला औपचारिक नोटीस" },
          { title: "मध्यस्थी", description: "निराकरणाचा प्रयत्न" },
          { title: "खटला", description: "आवश्यक असल्यास खटला दाखल करा" },
          { title: "न्यायाधीश/तोडगा", description: "अंतिम निराकरण" },
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

  // Define different workflow processes with translations
  const workflows = {
    general: {
      title: t.workflows.general.title,
      steps: t.workflows.general.steps.map((step, index) => ({
        id: (index + 1).toString(),
        title: step.title,
        description: step.description,
        position: { x: 50 + index * 150, y: 400 - index * 80 },
      })),
    },
    divorce: {
      title: t.workflows.divorce.title,
      steps: t.workflows.divorce.steps.map((step, index) => ({
        id: (index + 1).toString(),
        title: step.title,
        description: step.description,
        position: { x: 50 + index * 150, y: 400 - index * 80 },
      })),
    },
    contract: {
      title: t.workflows.contract.title,
      steps: t.workflows.contract.steps.map((step, index) => ({
        id: (index + 1).toString(),
        title: step.title,
        description: step.description,
        position: { x: 50 + index * 150, y: 400 - index * 80 },
      })),
    },
  };

  const currentWorkflow =
    workflows[processType as keyof typeof workflows] || workflows.general;

  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

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
      currentWorkflow.steps.map((step, index) => ({
        id: step.id,
        type: "workflow",
        position: step.position,
        data: {
          id: step.id,
          title: step.title,
          description: step.description,
          completed: completedSteps.has(step.id),
          onToggle: handleStepToggle,
          completedText: t.completed,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      })),
    [currentWorkflow.steps, completedSteps, handleStepToggle, t.completed]
  );

  const initialEdges: Edge[] = useMemo(
    () =>
      currentWorkflow.steps.slice(0, -1).map((step, index) => ({
        id: `e${step.id}-${currentWorkflow.steps[index + 1].id}`,
        source: step.id,
        target: currentWorkflow.steps[index + 1].id,
        type: "animated",
        animated: true,
        style: { stroke: "#3b82f6", strokeWidth: 2 },
      })),
    [currentWorkflow.steps]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update workflow when language changes
  React.useEffect(() => {
    const newWorkflow =
      workflows[processType as keyof typeof workflows] || workflows.general;
    const newNodes = newWorkflow.steps.map((step, index) => ({
      id: step.id,
      type: "workflow",
      position: step.position,
      data: {
        id: step.id,
        title: step.title,
        description: step.description,
        completed: completedSteps.has(step.id),
        onToggle: handleStepToggle,
        completedText: t.completed,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));
    setNodes(newNodes);
  }, [
    currentLanguage,
    processType,
    completedSteps,
    handleStepToggle,
    t.completed,
    setNodes,
  ]);

  // Update nodes when completedSteps or language changes
  React.useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          completed: completedSteps.has(node.id),
          completedText: t.completed,
        },
      }))
    );
  }, [completedSteps, setNodes, t.completed]);

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

      <div style={{ height: "500px", width: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background color="#f3f4f6" gap={20} />
          <Controls />
        </ReactFlow>
      </div>

      <div className="mt-4 text-xs text-gray-500">{t.helpText}</div>
    </div>
  );
}
