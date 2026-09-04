"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, Globe, Mail, MessageCircle, Phone, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { contactDetails as contact } from "@/app/contact-data";

export function ContactPanel({ open, onOpenChange, returnFocus }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocus: () => void;
}) {
  const [copied, setCopied] = useState("");
  const [copyError, setCopyError] = useState("");
  const copyContact = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setCopyError("");
    } catch {
      setCopyError("暂时无法自动复制，请长按或选中文字复制。");
    }
  };

  return <Dialog open={open} onOpenChange={(next) => { onOpenChange(next); if (!next) { setCopied(""); setCopyError(""); } }}>
    <DialogContent className={`contact-dialog${contact.wechatQr ? "" : " contact-dialog--links-only"}`} overlayClassName="contact-modal-backdrop" showCloseButton={false}
      onCloseAutoFocus={(event) => { event.preventDefault(); returnFocus(); }}>
      <DialogClose asChild><Button variant="portfolio" size="control-icon" className="contact-dialog-close" aria-label="关闭联系方式弹窗"><X aria-hidden="true" /></Button></DialogClose>
      <div className="contact-dialog-heading">
        <span className="contact-eyebrow section-kicker">保持联系 <span lang="en">Contact</span></span>
        <DialogTitle>你好，我们聊聊。</DialogTitle>
        <DialogDescription>聊设计、项目合作，或一个还没成形的想法。</DialogDescription>
      </div>
      <div className={`contact-dialog-grid${contact.wechatQr ? "" : " contact-dialog-grid--links-only"}`}>
        <div className="contact-methods">
          {[{ label: "电话", value: contact.phone, href: `tel:${contact.phone}`, Icon: Phone },
            { label: "电子邮箱", value: contact.email, href: `mailto:${contact.email}`, Icon: Mail }].map(({ label, value, href, Icon }) =>
            <div className="contact-method" key={label}>
              <a href={href}><Icon size={21} /><span><small>{label}</small><strong>{value}</strong></span></a>
              <Button variant="portfolio" size="control-icon" type="button" className="contact-copy" onClick={() => copyContact(value)} aria-label={`复制${label}`}>
                {copied === value ? <Check size={17} /> : <Copy size={17} />}
              </Button>
            </div>
          )}
          <a className="contact-social-row" href={contact.xiaohongshu} target="_blank" rel="noreferrer">
            <span className="xhs-symbol" aria-hidden="true">小红书</span><span><small>设计日常与分享</small><strong>小红书个人主页</strong></span><ArrowUpRight size={19} />
          </a>
          <a className="contact-social-row" href={contact.website} target="_blank" rel="noreferrer">
            <Globe size={23} /><span><small>个人网站</small><strong>{contact.websiteLabel}</strong></span><ArrowUpRight size={19} />
          </a>
        </div>
        {contact.wechatQr && <div className="contact-wechat">
          <h3><MessageCircle size={19} />微信 <span className="label-en" lang="en">WeChat</span></h3>
          <a href={contact.wechatQr} target="_blank" rel="noreferrer" aria-label="查看微信二维码原图"><img src={contact.wechatQr} alt="王博晨的个人微信二维码" width={240} height={240} /></a>
          <p>微信扫一扫，或长按保存图片</p>
        </div>}
      </div>
      <p className="contact-copy-status" role="status" aria-live="polite">{copyError || (copied ? "已复制到剪贴板" : "")}</p>
    </DialogContent>
  </Dialog>;
}
