"""สังเคราะห์เสียงประกอบ promo (ไม่ใช้ไฟล์เสียงภายนอก จึงไม่ติดลิขสิทธิ์)
python3 sfx.py  -> out/sfx.wav  (เวลาของแต่ละเสียงตรงกับ timeline ใน index.html)
"""
import wave
from pathlib import Path

import numpy as np

SR = 48000
DUR = 33.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N)
R = np.zeros(N)


def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    L[i : i + len(sig)] += sig * (1 - max(0, pan))
    R[i : i + len(sig)] += sig * (1 + min(0, pan))


def env(n, a, d):
    """attack (s) แล้ว decay แบบ exponential (s)"""
    t = np.arange(n) / SR
    e = np.exp(-np.maximum(t - a, 0) / d)
    e[t < a] = t[t < a] / max(a, 1e-4)
    return e


def lowpass(x, cutoff):
    """one-pole lowpass; cutoff เป็นค่าคงที่หรือ array ต่อ sample"""
    cutoff = np.broadcast_to(cutoff, x.shape)
    y = np.zeros_like(x)
    acc = 0.0
    k = 1 - np.exp(-2 * np.pi * cutoff / SR)
    for i in range(len(x)):
        acc += k[i] * (x[i] - acc)
        y[i] = acc
    return y


def pop(f0=900, f1=260, length=0.14):
    n = int(SR * length)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.025)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(n, 0.002, 0.04)


def tick(f=2400, length=0.06):
    n = int(SR * length)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) * 0.6 + rng.normal(0, 0.3, n)) * env(n, 0.001, 0.012)


def chime(f, length=1.6):
    n = int(SR * length)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.45 * np.sin(2 * np.pi * f * 2.76 * t) + 0.2 * np.sin(2 * np.pi * f * 5.4 * t)
    return s * env(n, 0.003, 0.35)


def whoosh(length=0.7, up=True):
    n = int(SR * length)
    x = rng.normal(0, 1, n)
    k = np.linspace(0, 1, n)
    cut = 300 + 5000 * (k if up else 1 - k) ** 1.5
    y = lowpass(x, cut) - lowpass(x, cut * 0.25)
    shape = np.sin(np.pi * k) ** 2
    return y * shape * 2.2


def kick():
    n = int(SR * 0.25)
    t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t / 0.03)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.09)


def hat():
    n = int(SR * 0.05)
    x = rng.normal(0, 1, n)
    return (x - lowpass(x, 6000)) * env(n, 0.001, 0.012)


# ── พื้นหลัง: คอร์ดนุ่ม ๆ (ไม่ใส่เสียงลม เพราะ noise ที่กรองแบบ one-pole เหลือเสียงซ่าตลอดคลิป) ──
t = np.arange(N) / SR
fade = np.clip(t / 1.5, 0, 1) * np.clip((DUR - t) / 1.2, 0, 1)
pad = np.zeros(N)
for f, a in [(130.81, 0.5), (196.0, 0.35), (329.63, 0.25), (587.33, 0.12), (493.88, 0.08)]:
    pad += a * np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.15 * t + f))
pad = lowpass(pad, 1800) * fade * 0.10
add(pad, 0)

# ── บีตเบา ๆ 120 BPM ตั้งแต่โลโก้เด้ง ──
beat = 0.5
b = 0.35
while b < 31.9:
    add(kick(), b, 0.28)
    add(hat(), b + beat / 2, 0.10, pan=0.3)
    b += beat

# ── เหตุการณ์ตาม timeline ──
WHOOSH = [4.0, 8.2, 14.5, 18.2, 23.6, 27.3]
for i, w in enumerate(WHOOSH):
    add(whoosh(0.75, up=i % 2 == 0), w, 0.35, pan=(-0.4 if i % 2 else 0.4))

POPS = [(0.35, 1.0), (1.9, 0.6), (4.7, 0.9), (5.6, 0.7), (8.9, 0.6), (9.8, 0.8), (15.2, 0.6), (15.4, 0.7),
        (15.65, 0.7), (24.3, 0.6), (24.6, 1.0), (25.0, 0.7), (27.8, 0.9), (28.4, 1.0), (29.3, 0.9)]
for tt, g in POPS:
    add(pop(), tt, 0.45 * g)

TICKS = [1.25, 6.2, 10.2, 10.9, 11.35, 11.8, 16.2, 16.6, 17.0, 22.9, 25.5, 25.8, 26.1, 28.9, 29.6]
for i, tt in enumerate(TICKS):
    add(tick(2000 + 300 * (i % 3)), tt, 0.25, pan=(-0.3 if i % 2 else 0.3))

# การ์ดดีด 6 ใบ
for i in range(6):
    add(tick(1400 + 120 * i, 0.08), 19.6 + i * 0.12, 0.22, pan=(i - 2.5) / 3)

# กระดิ่งไล่โน้ตตอนไฮไลต์การ์ด (pentatonic)
NOTES = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]
for i, f in enumerate(NOTES):
    add(chime(f), 21.2 + i * 0.3, 0.16, pan=(i - 2.5) / 3)

# ประกาย
for tt, f in [(0.5, 1567.98), (9.85, 1318.5), (18.9, 1760.0), (24.65, 1567.98), (29.35, 2093.0)]:
    add(chime(f, 1.2), tt, 0.12)
# คอร์ดปิดท้ายตอน CTA
for f in (523.25, 659.25, 783.99, 1046.5):
    add(chime(f, 2.0), 28.4, 0.12)

# ── master ──
mix = np.stack([L, R], 1)
mix = np.tanh(mix * 1.1)  # soft clip
mix *= 0.89 / np.max(np.abs(mix))
out = Path(__file__).parent / 'out'
out.mkdir(exist_ok=True)
with wave.open(str(out / 'sfx.wav'), 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('wrote', out / 'sfx.wav')
