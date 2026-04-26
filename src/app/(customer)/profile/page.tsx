"use client";
import { useState } from "react";
import { PageHeader }  from "@/components/ui/page-header";
import { Card }        from "@/components/ui/card";
import { Input }       from "@/components/ui/input";
import { Button }      from "@/components/ui/button";
import { Avatar }      from "@/components/ui/avatar";
import { Switch }      from "@/components/ui/switch";
import { Separator }   from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast }         from "sonner";
import { Camera, LogOut, Trash2, Bell, Lock, Eye, EyeOff } from "lucide-react";

export default function CustomerProfilePage() {
  const [saving,     setSaving]     = useState(false);
  const [showPw,     setShowPw]     = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: "Adaeze Okonkwo",
    email:    "adaeze@email.com",
    phone:    "+44 7700 900111",
  });
  const [prefs, setPrefs] = useState({
    emailReminders: true,
    smsReminders:   false,
    marketingEmails: true,
  });
  const [pw, setPw] = useState({ current:"", newPw:"", confirm:"" });

  const setF = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    toast.success("Profile updated!");
  };

  const handlePwChange = async () => {
    if (!pw.current || !pw.newPw || pw.newPw !== pw.confirm) {
      toast.error("Please fill all fields and make sure passwords match");
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setPw({ current:"", newPw:"", confirm:"" });
    toast.success("Password updated!");
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-6 animate-fade-in">
      <PageHeader eyebrow="Account" title="My Profile" />

      {/* Avatar + name */}
      <Card variant="elevated">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar name={form.fullName} size="xl" />
            <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-gold border-2 border-charcoal flex items-center justify-center hover:brightness-110 transition-all shadow-gold">
              <Camera className="h-3.5 w-3.5 text-obsidian" />
            </button>
          </div>
          <div>
            <p className="font-heading text-xl text-white">{form.fullName}</p>
            <p className="font-body text-sm text-mist">{form.email}</p>
            <p className="font-body text-xs text-ash mt-1">Member since January 2024</p>
          </div>
        </div>
      </Card>

      {/* Personal info */}
      <Card variant="elevated">
        <h3 className="font-heading text-lg text-white mb-5">Personal Information</h3>
        <div className="space-y-4">
          <Input label="Full Name"    value={form.fullName} onChange={setF("fullName")} />
          <Input label="Email"        value={form.email}    onChange={setF("email")}    type="email" />
          <Input label="Phone Number" value={form.phone}    onChange={setF("phone")}    type="tel" />
        </div>
        <div className="flex justify-end mt-6">
          <Button size="sm" loading={saving} onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card variant="elevated">
        <div className="flex items-center gap-3 mb-5">
          <Bell className="h-5 w-5 text-gold" />
          <h3 className="font-heading text-lg text-white">Notifications</h3>
        </div>
        <div className="space-y-5">
          <Switch label="Email appointment reminders" description="Receive reminders 24 hours before your booking"
            checked={prefs.emailReminders} onCheckedChange={v => setPrefs(p => ({...p, emailReminders: v}))} />
          <Switch label="SMS reminders" description="Get a text message reminder before your appointment"
            checked={prefs.smsReminders} onCheckedChange={v => setPrefs(p => ({...p, smsReminders: v}))} />
          <Switch label="Marketing emails" description="News, tips, and special offers from SalonOS"
            checked={prefs.marketingEmails} onCheckedChange={v => setPrefs(p => ({...p, marketingEmails: v}))} />
        </div>
      </Card>

      {/* Change password */}
      <Card variant="elevated">
        <div className="flex items-center gap-3 mb-5">
          <Lock className="h-5 w-5 text-gold" />
          <h3 className="font-heading text-lg text-white">Change Password</h3>
        </div>
        <div className="space-y-4">
          <Input label="Current Password" type={showPw ? "text" : "password"} value={pw.current}
            onChange={e => setPw(p => ({...p, current: e.target.value}))}
            iconRight={<button type="button" onClick={() => setShowPw(v=>!v)} className="text-mist hover:text-silver">
              {showPw ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
            </button>} />
          <Input label="New Password"     type={showPw ? "text" : "password"} value={pw.newPw}
            onChange={e => setPw(p => ({...p, newPw: e.target.value}))} />
          <Input label="Confirm New Password" type={showPw ? "text" : "password"} value={pw.confirm}
            onChange={e => setPw(p => ({...p, confirm: e.target.value}))}
            error={pw.confirm && pw.newPw !== pw.confirm ? "Passwords don't match" : undefined} />
        </div>
        <div className="flex justify-end mt-6">
          <Button size="sm" variant="secondary" loading={saving} onClick={handlePwChange}>Update Password</Button>
        </div>
      </Card>

      {/* Danger zone */}
      <Card variant="default" className="border-danger/20">
        <h3 className="font-heading text-base text-danger-text mb-4">Danger Zone</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm" className="border-ash text-silver">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
          <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" /> Delete Account
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={deleteOpen} onOpenChange={setDeleteOpen}
        title="Delete Your Account"
        description="This will permanently delete your account and all booking history. This action cannot be undone."
        confirmLabel="Delete My Account" variant="danger"
        onConfirm={() => { setDeleteOpen(false); toast.error("Account deletion not available in demo"); }}
      />
    </div>
  );
}
