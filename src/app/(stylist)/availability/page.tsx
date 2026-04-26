"use client";
import { useState } from "react";
import { PageHeader }  from "@/components/ui/page-header";
import { Card }        from "@/components/ui/card";
import { Button }      from "@/components/ui/button";
import { Switch }      from "@/components/ui/switch";
import { Badge }       from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input }       from "@/components/ui/input";
import { Textarea }    from "@/components/ui/textarea";
import { CalendarPicker } from "@/components/ui/calendar-picker";
import { toast }       from "sonner";
import { Plus, Trash2, Clock, Lock } from "lucide-react";
import { format, addDays } from "date-fns";

type DayKey = "MONDAY"|"TUESDAY"|"WEDNESDAY"|"THURSDAY"|"FRIDAY"|"SATURDAY"|"SUNDAY";

interface DaySchedule { start: string; end: string; active: boolean; }
interface BlockedSlot  { id: string; date: string; start: string; end: string; reason: string; }

const DAYS: Array<{ key: DayKey; label: string; short: string }> = [
  { key:"MONDAY",    label:"Monday",    short:"Mon" },
  { key:"TUESDAY",   label:"Tuesday",   short:"Tue" },
  { key:"WEDNESDAY", label:"Wednesday", short:"Wed" },
  { key:"THURSDAY",  label:"Thursday",  short:"Thu" },
  { key:"FRIDAY",    label:"Friday",    short:"Fri" },
  { key:"SATURDAY",  label:"Saturday",  short:"Sat" },
  { key:"SUNDAY",    label:"Sunday",    short:"Sun" },
];

const DEFAULT_SCHEDULE: Record<DayKey, DaySchedule> = {
  MONDAY:    { start:"09:00", end:"17:00", active:true  },
  TUESDAY:   { start:"09:00", end:"17:00", active:true  },
  WEDNESDAY: { start:"09:00", end:"17:00", active:true  },
  THURSDAY:  { start:"09:00", end:"17:00", active:true  },
  FRIDAY:    { start:"09:00", end:"18:00", active:true  },
  SATURDAY:  { start:"10:00", end:"16:00", active:true  },
  SUNDAY:    { start:"10:00", end:"14:00", active:false },
};

export default function StylistAvailabilityPage() {
  const [schedule,  setSchedule]  = useState<Record<DayKey, DaySchedule>>(DEFAULT_SCHEDULE);
  const [blocked,   setBlocked]   = useState<BlockedSlot[]>([]);
  const [blockOpen, setBlockOpen] = useState(false);
  const [saving,    setSaving]    = useState(false);

  // Block form state
  const [blockDate,   setBlockDate]   = useState<Date | null>(null);
  const [blockStart,  setBlockStart]  = useState("12:00");
  const [blockEnd,    setBlockEnd]    = useState("13:00");
  const [blockReason, setBlockReason] = useState("");

  const updateDay = (day: DayKey, patch: Partial<DaySchedule>) =>
    setSchedule(s => ({ ...s, [day]: { ...s[day], ...patch } }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    toast.success("Availability saved!", { description: "Your schedule is now live." });
  };

  const addBlock = () => {
    if (!blockDate) return;
    const newBlock: BlockedSlot = {
      id:     `bl-${Date.now()}`,
      date:   format(blockDate, "yyyy-MM-dd"),
      start:  blockStart,
      end:    blockEnd,
      reason: blockReason || "Unavailable",
    };
    setBlocked(b => [...b, newBlock]);
    setBlockOpen(false);
    setBlockDate(null);
    setBlockReason("");
    toast.success("Time blocked successfully");
  };

  const removeBlock = (id: string) => {
    setBlocked(b => b.filter(x => x.id !== id));
    toast.success("Block removed");
  };

  // Active days count
  const activeDays = Object.values(schedule).filter(d => d.active).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        eyebrow="Schedule"
        title="Availability Manager"
        description="Set your weekly hours and block off time when you're unavailable"
        actions={
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" onClick={() => setBlockOpen(true)}>
              <Lock className="h-4 w-4" /> Block Time
            </Button>
            <Button size="sm" loading={saving} onClick={handleSave}>
              Save Schedule
            </Button>
          </div>
        }
      />

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2">
        {DAYS.map(({ key, short }) => (
          <div key={key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-body text-xs transition-all ${
            schedule[key].active
              ? "bg-gold/10 border-gold/25 text-gold-light"
              : "bg-graphite border-ash/40 text-ash line-through"
          }`}>
            <div className={`h-1.5 w-1.5 rounded-full ${schedule[key].active ? "bg-gold" : "bg-ash"}`} />
            {short}
            {schedule[key].active && (
              <span className="text-mist ml-0.5">
                {schedule[key].start}–{schedule[key].end}
              </span>
            )}
          </div>
        ))}
        <div className="flex items-center px-3 py-1.5 rounded-full bg-smoke border border-ash/40 font-body text-xs text-mist">
          {activeDays}/7 days active
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">

        {/* Weekly schedule editor */}
        <Card variant="elevated" className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="font-heading text-lg text-white">Weekly Schedule</h2>
            <span className="font-body text-xs text-mist">Drag times to adjust</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {DAYS.map(({ key, label }) => {
              const day = schedule[key];
              return (
                <div key={key} className={`flex items-center gap-4 px-6 py-4 transition-colors ${!day.active ? "opacity-50" : ""}`}>
                  {/* Toggle + day name */}
                  <div className="w-32 flex items-center gap-3 shrink-0">
                    <Switch
                      checked={day.active}
                      onCheckedChange={v => updateDay(key, { active: v })}
                    />
                    <span className={`font-body text-sm ${day.active ? "text-pearl" : "text-mist"}`}>{label}</span>
                  </div>

                  {day.active ? (
                    <div className="flex items-center gap-3 flex-1">
                      {/* Start time */}
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-mist shrink-0" />
                        <input
                          type="time"
                          value={day.start}
                          onChange={e => updateDay(key, { start: e.target.value })}
                          className="bg-smoke border border-ash/60 rounded-lg px-3 py-1.5 font-mono text-sm text-pearl outline-none focus:border-gold transition-colors w-28"
                        />
                      </div>
                      <span className="text-mist font-body text-xs">to</span>
                      {/* End time */}
                      <input
                        type="time"
                        value={day.end}
                        onChange={e => updateDay(key, { end: e.target.value })}
                        className="bg-smoke border border-ash/60 rounded-lg px-3 py-1.5 font-mono text-sm text-pearl outline-none focus:border-gold transition-colors w-28"
                      />
                      {/* Duration pill */}
                      <span className="font-body text-xs text-mist ml-2">
                        {(() => {
                          const [sh,sm] = day.start.split(":").map(Number);
                          const [eh,em] = day.end.split(":").map(Number);
                          const mins    = (eh*60+em)-(sh*60+sm);
                          return `${Math.floor(mins/60)}h${mins%60>0?` ${mins%60}m`:""}`;
                        })()}
                      </span>
                    </div>
                  ) : (
                    <span className="font-body text-sm text-ash italic">Day off</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Blocked times */}
        <div className="space-y-4">
          <Card variant="default" className="p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <h2 className="font-heading text-base text-white">Blocked Times</h2>
              <Button size="sm" variant="ghost" onClick={() => setBlockOpen(true)}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
            {blocked.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <Lock className="h-6 w-6 text-ash mx-auto mb-2" />
                <p className="font-body text-sm text-mist">No blocked times</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {blocked.map(b => (
                  <div key={b.id} className="flex items-start justify-between gap-3 px-5 py-3.5 group hover:bg-smoke/50 transition-colors">
                    <div className="min-w-0">
                      <p className="font-body text-sm text-pearl font-medium">{b.reason}</p>
                      <p className="font-mono text-xs text-mist mt-0.5">
                        {format(new Date(b.date), "MMM d")} · {b.start}–{b.end}
                      </p>
                    </div>
                    <button
                      onClick={() => removeBlock(b.id)}
                      className="opacity-0 group-hover:opacity-100 text-ash hover:text-danger-text transition-all p-1 rounded-md hover:bg-danger-bg"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Tip card */}
          <Card variant="gold" className="py-4 px-5">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-gold mb-2">💡 Tip</p>
            <p className="font-body text-xs text-silver leading-relaxed">
              Blocked times override your weekly schedule. Use them for lunch breaks, personal appointments, or holidays.
            </p>
          </Card>
        </div>
      </div>

      {/* Block time dialog */}
      <Dialog open={blockOpen} onOpenChange={setBlockOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Block Time Off</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-silver mb-3">Select Date</p>
              <CalendarPicker selected={blockDate} onSelect={setBlockDate} minDate={new Date()} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Start Time" type="time" value={blockStart} onChange={e => setBlockStart(e.target.value)} />
              <Input label="End Time"   type="time" value={blockEnd}   onChange={e => setBlockEnd(e.target.value)}   />
            </div>
            <Input label="Reason (optional)" placeholder="Lunch break, appointment…" value={blockReason} onChange={e => setBlockReason(e.target.value)} />
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setBlockOpen(false)}>Cancel</Button>
            <Button size="sm" disabled={!blockDate} onClick={addBlock}>Block Time</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
