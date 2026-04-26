"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card }       from "@/components/ui/card";
import { Switch }     from "@/components/ui/switch";
import { Badge }      from "@/components/ui/badge";
import { Input }      from "@/components/ui/input";
import { Button }     from "@/components/ui/button";
import { toast }      from "sonner";
import { Clock, DollarSign } from "lucide-react";

const ALL_SERVICES = [
  { id:"s1", name:"Knotless Box Braids", category:"BRAIDING",     base:30000, duration:300, offered:true,  override:null as number|null },
  { id:"s2", name:"Cornrows",            category:"BRAIDING",     base:12000, duration:120, offered:true,  override:null as number|null },
  { id:"s3", name:"Faux Locs",           category:"BRAIDING",     base:45000, duration:360, offered:true,  override:48000              },
  { id:"s4", name:"Wash & Style",        category:"NATURAL_HAIR", base:10000, duration:90,  offered:true,  override:null as number|null },
  { id:"s5", name:"Twist-Out Set",       category:"NATURAL_HAIR", base:14000, duration:120, offered:false, override:null as number|null },
  { id:"s6", name:"Loc Retwist",         category:"NATURAL_HAIR", base:12000, duration:90,  offered:true,  override:null as number|null },
  { id:"s7", name:"Precision Cut",       category:"HAIR_CUT",     base:8000,  duration:60,  offered:false, override:null as number|null },
  { id:"s8", name:"Deep Conditioning",   category:"TREATMENT",    base:8000,  duration:60,  offered:true,  override:null as number|null },
];

export default function StylistServicesPage() {
  const [services, setServices] = useState(ALL_SERVICES);
  const [saving,   setSaving]   = useState(false);

  const toggle = (id: string) =>
    setServices(s => s.map(x => x.id === id ? {...x, offered: !x.offered} : x));
  const setOverride = (id: string, val: string) =>
    setServices(s => s.map(x => x.id === id ? {...x, override: val ? Number(val) : null} : x));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    toast.success("Services updated!");
  };

  const offered = services.filter(s => s.offered).length;

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <PageHeader eyebrow="Services" title="My Services"
        description={`You offer ${offered} of ${services.length} available services`}
        actions={<Button size="sm" loading={saving} onClick={handleSave}>Save Changes</Button>}
      />

      <Card variant="elevated" className="p-0 overflow-hidden">
        <div className="divide-y divide-white/[0.04]">
          {services.map(s => (
            <div key={s.id} className={`flex items-center gap-4 px-6 py-4 transition-colors ${!s.offered ? "opacity-50" : ""}`}>
              <Switch checked={s.offered} onCheckedChange={() => toggle(s.id)} />
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-pearl">{s.name}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 font-body text-2xs text-mist">
                    <Clock className="h-3 w-3" />{Math.floor(s.duration/60)}h{s.duration%60>0?` ${s.duration%60}m`:""}
                  </span>
                  <span className="font-body text-2xs text-mist">Base: £{s.base.toLocaleString()}</span>
                </div>
              </div>
              {s.offered && (
                <div className="w-32 shrink-0">
                  <Input
                    placeholder={`£${s.base.toLocaleString()}`}
                    value={s.override ?? ""}
                    onChange={e => setOverride(s.id, e.target.value)}
                    icon={<span className="text-mist text-xs">£</span>}
                  />
                </div>
              )}
              {s.override && (
                <Badge variant="gold">Custom price</Badge>
              )}
            </div>
          ))}
        </div>
      </Card>
      <p className="font-body text-xs text-mist px-1">Leave price blank to use the salon's base price. Set a custom price to override it for your profile.</p>
    </div>
  );
}
