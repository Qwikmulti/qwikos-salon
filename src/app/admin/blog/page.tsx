"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, BookOpen, Search } from "lucide-react";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
  author: string;
  publishedAt: Date | null;
  createdAt: Date;
  coverImageUrl: string | null;
  coverImagePath: string | null;
}

const EMPTY_FORM = {
  title: "", slug: "", excerpt: "", content: "", tags: "", published: false, author: "", coverImageUrl: null as string | null, coverImagePath: null as string | null
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        if (data.posts) {
          setPosts(data.posts.map((p: any) => ({
            ...p,
            publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
            createdAt: new Date(p.createdAt),
          })));
        }
      } catch (e) {
        console.error("Failed to load posts:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.excerpt.toLowerCase().includes(query.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setOpen(true); };
  const openEdit = (p: Post) => {
    setEditing(p);
    setForm({
      title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content,
      tags: p.tags.join(", "), published: p.published, author: p.author,
      coverImageUrl: p.coverImageUrl, coverImagePath: p.coverImagePath
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.slug) return;
    setSaving(true);
    try {
      const method = editing ? "PATCH" : "POST";
      const body = editing ? { ...form, id: editing.id } : form;
      await fetch("/api/blog", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      toast.success(editing ? "Post updated" : "Post created");
      setOpen(false);
      window.location.reload();
    } catch (e) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (id: string, current: boolean) => {
    try {
      await fetch("/api/blog", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, published: !current }) });
      setPosts(posts.map(p => p.id === id ? { ...p, published: !current } : p));
      toast.success(!current ? "Published" : "Unpublished");
    } catch (e) {
      toast.error("Failed to update");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader eyebrow="Content" title="Blog Posts" />
        <div className="h-96 flex items-center justify-center"><p className="text-mist">Loading...</p></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Content"
        title="Blog Posts"
        description={`${posts.length} posts`}
        actions={<Button size="sm" onClick={openCreate}><Plus className="h-4 w-4" /> New Post</Button>}
      />

      <Input placeholder="Search posts…" icon={<Search className="h-4 w-4" />} value={query} onChange={e => setQuery(e.target.value)} />

      <Card variant="elevated" className="p-0 overflow-hidden">
        <div className="divide-y divide-white/[0.04]">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-mist">No posts found</div>
          ) : (
            filtered.map(p => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-smoke/40 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-pearl">{p.title}</p>
                  <p className="font-body text-xs text-mist truncate">{p.excerpt}</p>
                </div>
                <Badge variant={p.published ? "success" : "default"}>{p.published ? "Published" : "Draft"}</Badge>
                <Button variant="ghost" size="sm" onClick={() => openEdit(p)}><Pencil className="h-3 w-3" /></Button>
                <Button variant="ghost" size="sm" onClick={() => togglePublish(p.id, p.published)}>
                  {p.published ? <Eye className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
          <DialogBody className="space-y-4">
            <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <Input label="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
            <Textarea label="Excerpt" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} />
            <Textarea label="Content (Markdown)" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={8} />
            <Input label="Tags (comma separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
            <div className="flex items-center gap-2">
              <Switch checked={form.published} onCheckedChange={v => setForm({ ...form, published: v })} />
              <span className="font-body text-sm text-silver">Published</span>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button loading={saving} onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}