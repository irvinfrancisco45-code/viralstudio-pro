import React, { useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  CheckCheck,
  ImagePlus,
  Mic,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { ChatData, ChatMessage } from '../types';

interface ChatBuilderProps {
  chatData: ChatData;
  onChange: (updated: ChatData) => void;
}

const REACTIONS = ['', '❤️', '😂', '😮', '😢', '🙏', '🔥', '👍'];

export const ChatBuilder: React.FC<ChatBuilderProps> = ({ chatData, onChange }) => {
  const [sender, setSender] = useState<'me' | 'other' | 'other2'>('me');
  const [senderName, setSenderName] = useState('Carlos');
  const [msgType, setMsgType] = useState<'text' | 'image' | 'voice'>('text');
  const [msgText, setMsgText] = useState('');
  const [msgTime, setMsgTime] = useState('21:16');
  const [msgStatus, setMsgStatus] = useState<'sent' | 'delivered' | 'read'>('read');
  const [voiceDuration, setVoiceDuration] = useState('0:18');
  const [msgImageUrl, setMsgImageUrl] = useState('');
  const [replyToText, setReplyToText] = useState('');
  const [reaction, setReaction] = useState('');

  const contactAvatarInputRef = useRef<HTMLInputElement>(null);
  const msgImageInputRef = useRef<HTMLInputElement>(null);
  const wallpaperInputRef = useRef<HTMLInputElement>(null);

  const handleFileToDataUrl = (file: File, cb: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') cb(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (msgType === 'text' && !msgText.trim()) return;
    if (msgType === 'image' && !msgImageUrl) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender,
      senderName:
        sender === 'other'
          ? chatData.contactName
          : sender === 'other2'
            ? senderName || 'Participante'
            : undefined,
      type: msgType,
      text: msgType === 'voice' ? 'Nota de voz' : msgText.trim(),
      imageDataUrl: msgType === 'image' ? msgImageUrl : undefined,
      voiceDuration: msgType === 'voice' ? voiceDuration : undefined,
      time: msgTime || '21:16',
      status: msgStatus,
      replyToText: replyToText.trim() ? replyToText.trim() : undefined,
      replyToSender: replyToText.trim()
        ? sender === 'me'
          ? chatData.contactName
          : 'Tú'
        : undefined,
      reaction: reaction || undefined,
    };

    onChange({
      ...chatData,
      messages: [...chatData.messages, newMsg],
    });
    setMsgText('');
    setReplyToText('');
    setReaction('');
  };

  const moveMessage = (idx: number, direction: -1 | 1) => {
    const next = [...chatData.messages];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= next.length) return;
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    onChange({ ...chatData, messages: next });
  };

  const deleteMessage = (id: string) => {
    onChange({
      ...chatData,
      messages: chatData.messages.filter((m) => m.id !== id),
    });
  };

  const cycleStatus = (id: string) => {
    const order: ChatMessage['status'][] = ['sent', 'delivered', 'read'];
    onChange({
      ...chatData,
      messages: chatData.messages.map((m) =>
        m.id === id
          ? { ...m, status: order[(order.indexOf(m.status) + 1) % order.length] }
          : m
      ),
    });
  };

  return (
    <div className="space-y-5">
      {/* Contact & Header Settings */}
      <div className="p-3.5 bg-[#121419] border border-slate-800/80 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-slate-200">Contacto y Barra del Teléfono</h4>
          <label className="inline-flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={chatData.isGroup}
              onChange={(e) => onChange({ ...chatData, isGroup: e.target.checked })}
              className="rounded accent-indigo-500"
            />
            Modo Grupo
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => contactAvatarInputRef.current?.click()}
            className="w-11 h-11 rounded-full overflow-hidden border border-slate-700 shrink-0 relative group"
            title="Cambiar foto del contacto"
          >
            <img
              src={chatData.contactAvatar}
              alt={chatData.contactName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <span className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Upload className="w-3.5 h-3.5 text-white" />
            </span>
          </button>
          <input
            ref={contactAvatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileToDataUrl(file, (url) =>
                  onChange({ ...chatData, contactAvatar: url })
                );
              }
            }}
          />
          <div className="flex-1 space-y-1.5">
            <input
              type="text"
              value={chatData.contactName}
              onChange={(e) => onChange({ ...chatData, contactName: e.target.value })}
              placeholder="Nombre del contacto o grupo"
              className="w-full px-2.5 py-1.5 text-xs bg-[#181B20] border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            />
            <select
              value={chatData.statusText}
              onChange={(e) => onChange({ ...chatData, statusText: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs bg-[#181B20] border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="en línea">en línea</option>
              <option value="escribiendo...">escribiendo...</option>
              <option value="grabando audio...">grabando audio...</option>
              <option value="últ. vez hoy a las 14:22">últ. vez hoy a las 14:22</option>
              <option value="Activo ahora">Activo ahora</option>
              <option value="4 miembros en línea">4 miembros en línea</option>
            </select>
          </div>
        </div>

        {/* Phone status bar controls */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Hora</label>
            <input
              type="text"
              value={chatData.phoneTime}
              onChange={(e) => onChange({ ...chatData, phoneTime: e.target.value })}
              className="w-full px-2 py-1 text-xs font-mono tabular-nums bg-[#181B20] border border-slate-800 rounded-md text-slate-200"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Batería %</label>
            <input
              type="number"
              min={1}
              max={100}
              value={chatData.batteryPercent}
              onChange={(e) =>
                onChange({
                  ...chatData,
                  batteryPercent: Math.max(1, Math.min(100, Number(e.target.value) || 80)),
                })
              }
              className="w-full px-2 py-1 text-xs font-mono tabular-nums bg-[#181B20] border border-slate-800 rounded-md text-slate-200"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Señal</label>
            <select
              value={chatData.signalStrength}
              onChange={(e) =>
                onChange({ ...chatData, signalStrength: Number(e.target.value) })
              }
              className="w-full px-2 py-1 text-xs bg-[#181B20] border border-slate-800 rounded-md text-slate-200"
            >
              <option value={4}>4 barras</option>
              <option value={3}>3 barras</option>
              <option value={2}>2 barras</option>
              <option value={1}>1 barra</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => onChange({ ...chatData, darkMode: !chatData.darkMode })}
            className="flex-1 py-1.5 px-2 text-xs font-medium rounded-lg bg-[#181B20] border border-slate-800 text-slate-200 hover:border-slate-700"
          >
            {chatData.darkMode ? 'Tema Oscuro' : 'Tema Claro'}
          </button>
          <select
            value={chatData.wallpaperStyle}
            onChange={(e) =>
              onChange({
                ...chatData,
                wallpaperStyle: e.target.value as ChatData['wallpaperStyle'],
              })
            }
            className="flex-1 py-1.5 px-2 text-xs bg-[#181B20] border border-slate-800 rounded-lg text-slate-200"
          >
            <option value="doodle">Fondo Patrón</option>
            <option value="default">Fondo Clásico</option>
            <option value="gradient">Degradado</option>
            <option value="solid">Sólido</option>
          </select>
          <button
            type="button"
            onClick={() => wallpaperInputRef.current?.click()}
            className="py-1.5 px-2.5 text-xs font-medium rounded-lg bg-[#181B20] border border-slate-800 text-slate-200 hover:border-indigo-500 whitespace-nowrap shrink-0"
            title="Subir fondo personalizado"
          >
            Fondo Img
          </button>
          <input
            ref={wallpaperInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileToDataUrl(file, (url) =>
                  onChange({ ...chatData, customWallpaper: url })
                );
              }
            }}
          />
        </div>
      </div>

      {/* Quick Message Constructor */}
      <form
        onSubmit={handleAddMessage}
        className="p-3.5 bg-[#121419] border border-slate-800/80 rounded-xl space-y-3"
      >
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-slate-200">Añadir Nuevo Mensaje</h4>
          <div className="flex items-center gap-1 p-0.5 bg-[#181B20] rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setMsgType('text')}
              className={`px-2 py-1 text-[11px] font-medium rounded-md ${
                msgType === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              Texto
            </button>
            <button
              type="button"
              onClick={() => setMsgType('voice')}
              className={`px-2 py-1 text-[11px] font-medium rounded-md inline-flex items-center gap-1 ${
                msgType === 'voice' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              <Mic className="w-3 h-3" />
              Audio
            </button>
            <button
              type="button"
              onClick={() => setMsgType('image')}
              className={`px-2 py-1 text-[11px] font-medium rounded-md inline-flex items-center gap-1 ${
                msgType === 'image' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              <ImagePlus className="w-3 h-3" />
              Foto
            </button>
          </div>
        </div>

        {/* Sender Selector */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setSender('me')}
            className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-colors ${
              sender === 'me'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-[#181B20] border-slate-800 text-slate-400'
            }`}
          >
            Yo (Enviado)
          </button>
          <button
            type="button"
            onClick={() => setSender('other')}
            className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-colors truncate ${
              sender === 'other'
                ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                : 'bg-[#181B20] border-slate-800 text-slate-400'
            }`}
          >
            {chatData.contactName.split(' ')[0] || 'Contacto'}
          </button>
          <button
            type="button"
            onClick={() => setSender('other2')}
            className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-colors ${
              sender === 'other2'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-[#181B20] border-slate-800 text-slate-400'
            }`}
          >
            3.º Grupo
          </button>
        </div>

        {sender === 'other2' && (
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Nombre de participante en grupo"
            className="w-full px-2.5 py-1.5 text-xs bg-[#181B20] border border-slate-800 rounded-lg text-slate-200"
          />
        )}

        {msgType === 'text' && (
          <textarea
            rows={2}
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
            placeholder="Escribe el mensaje..."
            className="w-full px-2.5 py-2 text-xs bg-[#181B20] border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        )}

        {msgType === 'voice' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Duración del audio:</span>
            <input
              type="text"
              value={voiceDuration}
              onChange={(e) => setVoiceDuration(e.target.value)}
              placeholder="0:18"
              className="w-24 px-2.5 py-1.5 text-xs font-mono tabular-nums bg-[#181B20] border border-slate-800 rounded-lg text-slate-100"
            />
          </div>
        )}

        {msgType === 'image' && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => msgImageInputRef.current?.click()}
              className="w-full py-2 px-3 text-xs font-medium bg-[#181B20] border border-dashed border-slate-700 hover:border-indigo-500 rounded-lg text-slate-300 flex items-center justify-center gap-2"
            >
              <Upload className="w-3.5 h-3.5" />
              {msgImageUrl ? 'Cambiar foto adjunta' : 'Seleccionar foto para enviar'}
            </button>
            <input
              ref={msgImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileToDataUrl(file, setMsgImageUrl);
              }}
            />
            {msgImageUrl && (
              <input
                type="text"
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                placeholder="Pie de foto opcional..."
                className="w-full px-2.5 py-1.5 text-xs bg-[#181B20] border border-slate-800 rounded-lg text-slate-200"
              />
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Hora</label>
            <input
              type="text"
              value={msgTime}
              onChange={(e) => setMsgTime(e.target.value)}
              className="w-full px-2 py-1.5 text-xs font-mono tabular-nums bg-[#181B20] border border-slate-800 rounded-lg text-slate-200"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Estado</label>
            <select
              value={msgStatus}
              onChange={(e) => setMsgStatus(e.target.value as ChatMessage['status'])}
              className="w-full px-2 py-1.5 text-xs bg-[#181B20] border border-slate-800 rounded-lg text-slate-200"
            >
              <option value="read">Leído (Azul)</option>
              <option value="delivered">Entregado</option>
              <option value="sent">Enviado</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Reacción</label>
            <select
              value={reaction}
              onChange={(e) => setReaction(e.target.value)}
              className="w-full px-2 py-1.5 text-xs bg-[#181B20] border border-slate-800 rounded-lg text-slate-200"
            >
              <option value="">Sin reacción</option>
              {REACTIONS.filter(Boolean).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <input
          type="text"
          value={replyToText}
          onChange={(e) => setReplyToText(e.target.value)}
          placeholder="Responder / citar mensaje anterior (opcional)"
          className="w-full px-2.5 py-1.5 text-xs bg-[#181B20] border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500"
        />

        <button
          type="submit"
          className="w-full py-2 px-4 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Añadir al Chat
        </button>
      </form>

      {/* Message List (Reorder & Delete) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-slate-300">
            Mensajes ({chatData.messages.length})
          </h4>
          {chatData.messages.length > 0 && (
            <button
              type="button"
              onClick={() => onChange({ ...chatData, messages: [] })}
              className="text-[11px] text-rose-400 hover:text-rose-300"
            >
              Vaciar chat
            </button>
          )}
        </div>

        <div className="space-y-1.5 max-h-64 overflow-y-auto studio-scroll pr-1">
          {chatData.messages.map((msg, idx) => (
            <div
              key={msg.id}
              className="p-2.5 bg-[#121419] border border-slate-800/80 rounded-lg flex items-start justify-between gap-2"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span
                    className={`font-semibold ${
                      msg.sender === 'me' ? 'text-emerald-400' : 'text-indigo-400'
                    }`}
                  >
                    {msg.sender === 'me' ? 'Yo' : msg.senderName || chatData.contactName}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{msg.time}</span>
                  {msg.sender === 'me' && (
                    <button
                      type="button"
                      onClick={() => cycleStatus(msg.id)}
                      className="inline-flex items-center hover:opacity-80"
                      title="Cambiar estado de lectura"
                    >
                      {msg.status === 'sent' ? (
                        <Check className="w-3 h-3 text-slate-400" />
                      ) : (
                        <CheckCheck
                          className={`w-3.5 h-3.5 ${
                            msg.status === 'read' ? 'text-sky-400' : 'text-slate-400'
                          }`}
                        />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-200 truncate mt-0.5">
                  {msg.type === 'voice'
                    ? `Nota de voz (${msg.voiceDuration})`
                    : msg.type === 'image'
                      ? `Foto adjunta${msg.text ? `: ${msg.text}` : ''}`
                      : msg.text}
                </p>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => moveMessage(idx, -1)}
                  disabled={idx === 0}
                  className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                  title="Subir"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveMessage(idx, 1)}
                  disabled={idx === chatData.messages.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                  title="Bajar"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteMessage(msg.id)}
                  className="p-1 text-slate-400 hover:text-rose-400"
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
