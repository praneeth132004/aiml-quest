
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ClassDiagramSwitcherProps {
  onChange: (view: string) => void;
  currentView: string;
}

const ClassDiagramSwitcher = ({ onChange, currentView }: ClassDiagramSwitcherProps) => {
  const views = [
    { id: "entities", name: "Data Entities" },
    { id: "components", name: "UI Components" },
    { id: "pages", name: "Pages" },
  ];

  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
      <Select value={currentView} onValueChange={onChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Select view" />
        </SelectTrigger>
        <SelectContent>
          {views.map((view) => (
            <SelectItem key={view.id} value={view.id}>
              {view.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex space-x-1">
        {views.map((view) => (
          <Button
            key={view.id}
            variant={currentView === view.id ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(view.id)}
            className="flex-1 sm:flex-none"
          >
            {view.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ClassDiagramSwitcher;
