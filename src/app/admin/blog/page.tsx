"use client";
import { useState } from "react";
import { PageHeader }  from "@/components/ui/page-header";
import { Card }        from "@/components/ui/card";
import { Badge }       from "@/components/ui/badge";
import { Button }      from "@/components/ui/button";
import { Input }       from "@/components/ui/input";
import { Textarea }    from "@/components/ui/textarea";
import { Switch }      from "@/components/ui/switch";
import { Separator }   from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ImageUpload }   from "@/components/shared/ImageUpload";
import { EmptyState }    from "@/components/ui/empty-state";
import { formatDate }    from "@/lib/utils/dates";
import { BUCKETS }       from "@/lib/supabase/storage";
import { toast }         from "sonner";
import { Plus, Pencil, Trash2, Eye, BookOpen, Search } from "lucide-react";
import Image from "next/image";

interface Post {
  id:string; title:string; slug:string; excerpt:string; content:string;
  tags:string[]; published:boolean; author:string;
  publishedAt:Date|null; createdAt:Date;
  coverImageUrl:string|null; coverImagePath:string|null;
}

const INIT_POSTS: Post[] = [
  { id:"p1", title:"How to Maintain Box Braids for 8+ Weeks", slug:"how-to-maintain-box-braids", excerpt:"Fatima shares her top secrets for keeping protective styles fresh for weeks.", content:"Full content...", tags:["Hair Care","Braiding"], published:true, author:"Fatima Hassan", publishedAt:new Date(Date.now()-86400000*9), createdAt:new Date(Date.now()-86400000*10), coverImageUrl:"https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80", coverImagePath:null },
  { id:"p2", title:"Balayage vs. Highlights: Which is Right for You?", slug:"balayage-vs-highlights", excerpt:"Breaking down the key differences so you walk in with confidence.", content:"Full content...", tags:["Colour","Education"], published:true, author:"Amara Diallo", publishedAt:new Date(Date.now()-86400000*15), createdAt:new Date(Date.now()-86400000*16), coverImageUrl:"https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80", coverImagePath:null },
  { id:"p3", title:"Understanding Natural Hair Porosity", slug:"natural-hair-porosity", excerpt:"Low, medium, or high — knowing your hair's porosity changes everything.", content:"Full content...", tags:["Natural Hair","Education"], published:false, author:"Fatima Hassan", publishedAt:null, createdAt:new Date(Date.now()-86400000*5), coverImageUrl:null, coverImagePath:null },
];

const EMPTY_FORM = { title:"", slug:"", excerpt:"", content:"", tags:"", published:false, author:"", coverImageUrl:null as string|null, coverImagePath:null as string|null };

export default function AdminBlogPage() {
  const [posts,    setPosts]    = useState<Post[]>(INIT_POSTS);
  const [query,    setQuery]    = useState("");
  const [open,     setOpen]     = useState(false);
  const [editing,  setEditing]  = useState<Post|null>(null);
  const [deleteId, setDeleteId] = useState<string|null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState(EMPTY_FORM);

  const setF = (k: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const slugify = (s:string) => s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setOpen(true); };
  const openEdit   = (p:Post) => {
    setEditing(p);
    setForm({ title:p.title, slug:p.slug, excerpt:p.excerpt, content:p.content, tags:p.tags.join(", "), published:p.published, author:p.author, coverImageUrl:p.coverImageUrl, coverImagePath:p.coverImagePath });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.title) return;
    setSaving(true);
    await new Promise(r => setTimeout(r,700));
    const tags = form.tags.split(",").map(t=>t.trim()).filter(Boolean);
    if (editing) {
      setPosts(prev => prev.map(p => p.id===editing.id ? { ...p, ...form, tags, slug: form.slug||slugify(form.title), publishedAt: form.published ? (p.publishedAt ?? new Date()) : null } : p));
      toast.success("Post updated");
    } else {
      setPosts(prev => [...prev, { id:`p-${Date.now()}`, ...form, tags, slug:form.slug||slugify(form.title), publishedAt:form.published?new Date():null, createdAt:new Date() }]);
      toast.success("Post created");
    }
    setSaving(false); setOpen(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await new Promise(r=>setTimeout(r,700));
    setPosts(prev=>prev.filter(p=>p.id!==deleteId));
    setDeleting(false); setDeleteId(null);
    toast.success("Post deleted");
  };

  const togglePublish = (id:string) => {
    setPosts(prev=>prev.map(p=>p.id===id ? {...p, published:!p.published, publishedAt:!p.published?new Date():null} : p));
    const post = posts.find(p=>p.id===id);
    toast.success(post?.published ? "Post unpublished" : "Post published!");
  };

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.author.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Content"
        title="Blog Manager"
        description={`${posts.filter(p=>p.published).length} published · ${posts.filter(p=>!p.published).length} drafts`}
        actions={<Button size="sm" onClick={openCreate}><Plus className="h-4 w-4" /> New Post</Button>}
      />

      <Input placeholder="Search posts or authors…" icon={<Search className="h-4 w-4"/>}
        value={query} onChange={e=>setQuery(e.target.value)} />

      {filtered.length===0 ? (
        <EmptyState icon={<BookOpen className="h-6 w-6 text-mist"/>} title="No posts found"
          action={{label:"Create First Post", onClick:openCreate}} />
      ) : (
        <div className="space-y-3">
          {filtered.map(post => (
            <Card key={post.id} variant="elevated" className="p-0 overflow-hidden group hover:border-gold/15 transition-all duration-200">
              <div className="flex items-start gap-4 p-5">
                {/* Cover thumbnail */}
                <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0 bg-smoke border border-ash/40">
                  {post.coverImageUrl ? (
                    <Image src={post.coverImageUrl} alt={post.title} width={64} height={64}
                      className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-2xl">📝</div>
                  )}
                </div>

                <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${post.published ? "bg-success-text shadow-[0_0_6px_rgba(82,183,136,0.5)]" : "bg-ash"}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <h3 className="font-heading text-lg text-white leading-snug mb-1 group-hover:text-gold-light transition-colors">{post.title}</h3>
                      <p className="font-body text-xs text-mist line-clamp-1 mb-3">{post.excerpt}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant={post.published?"success":"default"}>{post.published?"Published":"Draft"}</Badge>
                        {post.tags.map(tag=>(
                          <span key={tag} className="font-body text-2xs px-2 py-0.5 rounded-full bg-smoke border border-ash/40 text-silver">{tag}</span>
                        ))}
                        <span className="font-body text-2xs text-ash">by {post.author}</span>
                        {post.publishedAt&&<span className="font-body text-2xs text-ash">{formatDate(post.publishedAt)}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Switch checked={post.published} onCheckedChange={()=>togglePublish(post.id)} />
                      <Button variant="ghost" size="icon" onClick={()=>openEdit(post)}><Pencil className="h-4 w-4"/></Button>
                      {post.published&&(
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"><Eye className="h-4 w-4"/></a>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={()=>setDeleteId(post.id)}
                        className="text-ash hover:text-danger-text hover:bg-danger-bg"><Trash2 className="h-4 w-4"/></Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="lg">
          <DialogHeader><DialogTitle>{editing?"Edit Post":"New Blog Post"}</DialogTitle></DialogHeader>
          <DialogBody className="space-y-4 max-h-[65vh] overflow-y-auto">
            {/* Cover image */}
            <ImageUpload
              label="Cover Image"
              hint="Shown on blog listing and post page · JPG or PNG · Max 5MB"
              value={form.coverImageUrl}
              onChange={(url,path)=>setForm(f=>({...f,coverImageUrl:url,coverImagePath:path}))}
              onRemove={()=>setForm(f=>({...f,coverImageUrl:null,coverImagePath:null}))}
              bucket={BUCKETS.BLOG}
              uploadPath={`${editing?.id??`post-${Date.now()}`}.jpg`}
              shape="square"
              aspectRatio="landscape"
            />
            <Separator />
            <Input label="Title" placeholder="Post title…" value={form.title}
              onChange={e=>{setF("title")(e); if(!editing)setForm(f=>({...f,slug:slugify(e.target.value)}));}} />
            <Input label="Slug" placeholder="url-slug" value={form.slug} onChange={setF("slug")}
              hint="URL: /blog/your-slug" />
            <Input label="Author" placeholder="Stylist or staff name" value={form.author} onChange={setF("author")} />
            <Textarea label="Excerpt" placeholder="Short summary for the listing page…" rows={2} value={form.excerpt} onChange={setF("excerpt")} />
            <Textarea label="Content" placeholder="Full article content (Markdown supported)…" rows={8} value={form.content} onChange={setF("content")} />
            <Input label="Tags (comma separated)" placeholder="Hair Care, Braiding, Tips" value={form.tags} onChange={setF("tags")} />
            <Switch label="Publish immediately" description="Toggle off to save as a draft"
              checked={form.published} onCheckedChange={v=>setForm(f=>({...f,published:v}))} />
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={()=>setOpen(false)}>Cancel</Button>
            <Button size="sm" loading={saving} disabled={!form.title} onClick={handleSave}>
              {editing?"Save Changes":"Create Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={o=>!o&&setDeleteId(null)}
        title="Delete Post" description="This will permanently delete the blog post."
        confirmLabel="Delete Post" variant="danger" loading={deleting} onConfirm={handleDelete} />
    </div>
  );
}
