"use client";

import * as React from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const TEMPLATES: Record<string, string> = {
  mpesa_subsidy:
    "Dear Donor, KNH is experiencing a severe O- shortage. Please visit our drive tomorrow. Show this SMS for a 200 KES transport reimbursement via M-Pesa.",
  urgent_shortage:
    "EMERGENCY: Your blood type is critically low in the regional hub. Please visit your nearest donation center immediately to help save a life.",
  drive_reminder:
    "Hello! Our mobile blood drive will be in your area this Saturday. Stop by, donate, and check your digital health metrics on the ABIS app.",
};

export function OutreachModal() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [campaignType, setCampaignType] = React.useState("mpesa_subsidy");
  const [message, setMessage] = React.useState(TEMPLATES["mpesa_subsidy"]);

  // Update textarea automatically when a new campaign type is selected
  const handleCampaignChange = (value: string) => {
    setCampaignType(value);
    setMessage(TEMPLATES[value] || "");
  };

  // Simulate API call with 1.5s delay for the hackathon demo
  const handleDispatch = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsOpen(false);

      // Fire success green toast notification
      toast({
        title: "Campaign Dispatched",
        description: "Successfully queued 1,248 SMS messages.",
        variant: "default",
      });
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#126b54] hover:bg-[#0e5643] text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-xl transition-all shadow-sm">
          Create outreach campaign
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] rounded-2xl p-6 bg-white border border-slate-200">
        <DialogHeader>
          <div className="flex items-center justify-between mt-1">
            <DialogTitle className="text-xl font-bold text-slate-900 font-heading">
              Launch Targeted Intervention
            </DialogTitle>
            <Badge
              variant="destructive"
              className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none font-semibold text-[11px] px-2.5 py-1"
            >
              Targeting: 1,248 HIGH_RISK
            </Badge>
          </div>
          <DialogDescription className="pt-2 text-xs text-slate-500">
            Select a campaign template to re-engage lapsed donors based on their AI retention risk tier.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="grid gap-2">
            <Label htmlFor="campaign-type" className="text-xs font-semibold text-slate-700">
              Campaign Strategy
            </Label>
            <Select value={campaignType} onValueChange={handleCampaignChange}>
              <SelectTrigger id="campaign-type" className="h-10 text-xs rounded-xl border-slate-200">
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mpesa_subsidy">
                  Transport Subsidy (M-Pesa Integrated)
                </SelectItem>
                <SelectItem value="urgent_shortage">Urgent Shortage Alert</SelectItem>
                <SelectItem value="drive_reminder">Mobile Drive Reminder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message-preview" className="text-xs font-semibold text-slate-700">
              SMS Payload Preview
            </Label>
            <Textarea
              id="message-preview"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] text-xs text-slate-800 rounded-xl border-slate-200 focus-visible:border-[#126b54] focus-visible:ring-[#126b54]/20 resize-none"
            />
            <div className="flex items-center justify-end text-[11px] text-slate-400 font-mono">
              <span>{message.length} / 160 characters</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
            className="text-xs rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDispatch}
            disabled={isSubmitting}
            className="bg-[#126b54] hover:bg-[#0e5643] text-white text-xs font-semibold rounded-xl min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                Dispatching...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Dispatch Campaign
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
