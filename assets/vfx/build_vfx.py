from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math,json,subprocess,zipfile
R=Path(__file__).parent
C=['#174286','#2379c4','#46cfff','#a4f4ff','#f0ffff']
def effect(kind,n,N):
 im=Image.new('RGBA',(64,64));d=ImageDraw.Draw(im);t=n/N
 if kind=='frost_fracture':
  phase=t*3; stack=min(3,int(phase)+1)
  for j in range(stack):
   x=25+j*7;d.line([(x,40),(x-3,31),(x+1,25),(x-2,19)],fill=C[2],width=2);d.point((x,24),fill=C[4])
  if t>.67:
   p=(t-.67)/.33
   for j in range(12):
    a=j*math.tau/12;r=5+p*23;x=32+math.cos(a)*r;y=32+math.sin(a)*r*.8
    d.polygon([(x,y-4),(x+2,y),(x,y+3),(x-2,y)],fill=C[2+j%3])
   if p<.35:d.ellipse((25,25,39,39),outline=C[4],width=2)
 elif kind=='frozen_prison':
  strength=min(1,t*6,(1-t)*7);rx=int(26*strength);ry=int(12*strength)
  d.ellipse((32-rx,40-ry,32+rx,40+ry),fill=(30,135,230,65),outline=C[2],width=1)
  for j in range(7):
   a=j*math.tau/7;x=32+math.cos(a)*rx;y=40+math.sin(a)*ry;h=(8+j%3*3)*strength
   d.polygon([(x-3,y),(x-1,y-h),(x+2,y-h*.65),(x+3,y)],fill=C[1]);d.line([(x-1,y-h),(x+1,y-2)],fill=C[3],width=1)
  for j in range(6):
   a=j*math.tau/6+t*.8;d.line([(32+math.cos(a)*8,40+math.sin(a)*4),(32+math.cos(a)*18,40+math.sin(a)*8)],fill=C[2],width=1)
 else:
  for k in range(3):
   pts=[]
   for j in range(20):
    a=j*.17+t*math.tau+k*math.tau/3;r=8+j*.9
    pts.append((32+math.cos(a)*r,36+math.sin(a)*r*.48))
   d.line(pts,fill=C[1+k],width=2)
  for j in range(10):
   a=j*2.4+t*math.tau;r=12+j%4*4;x=32+math.cos(a)*r;y=30+math.sin(a)*r*.65-((t*18+j*4)%18)
   d.line([(x,y),(x-2,y+5)],fill=C[2+j%3],width=2)
 return im
specs=[('frost_fracture',24,12,False),('frozen_prison',24,20,False),('glacial_singularity',16,12,True)]
manifest={'version':'0.1-review','frame_size':[64,64],'pivot':[0.5,0.5],'filter':'Point','compression':'None','pixels_per_unit':64,'alpha':'straight','effects':[],'note':'Procedural review assets. Combat demonstrations are scripted illustrations, not Unity gameplay or balance verification.'}
for kind,N,fps,loop in specs:
 folder=R/kind;folder.mkdir(exist_ok=True);(folder/'frames').mkdir(exist_ok=True)
 sheet=Image.new('RGBA',(64*8,64*math.ceil(N/8)))
 for n in range(N):
  im=effect(kind,n,N);im.save(folder/'frames'/f'{n:03}.png');sheet.paste(im,(n%8*64,n//8*64))
 sheet.save(folder/'spritesheet.png')
 manifest['effects'].append({'id':kind,'frames':N,'fps':fps,'loop':loop,'columns':8,'sheet':f'{kind}/spritesheet.png','sorting':'ground below actors; shards above actors','duration_seconds':N/fps})
(R/'manifest.json').write_text(json.dumps(manifest,indent=2))
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
f=ImageFont.truetype(font,18);small=ImageFont.truetype(font,13);title=ImageFont.truetype(font,26)
def fox(im,x,y,boss=False,frozen=False):
 d=ImageDraw.Draw(im);s=2 if boss else 1;c='#ffad40' if not frozen else '#8aeaff'
 d.polygon([(x-10*s,y+6*s),(x-8*s,y-12*s),(x-3*s,y-7*s),(x+4*s,y-12*s),(x+10*s,y+6*s),(x,y+12*s)],fill=c,outline='#512c3c')
 d.rectangle((x-5*s,y,x-3*s,y+3*s),fill='#071222');d.rectangle((x+3*s,y,x+5*s,y+3*s),fill='#071222')
 d.polygon([(x-6*s,y+5*s),(x+6*s,y+5*s),(x,y+10*s)],fill='#fff1d1')
for idx,(kind,N,fps,loop) in enumerate(specs):
 duration=8 if loop else 6;rate=24;out=R/kind/'demo.mp4'
 proc=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pixel_format','rgb24','-video_size','960x540','-framerate',str(rate),'-i','-','-an','-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',str(out)],stdin=subprocess.PIPE)
 for n in range(duration*rate):
  t=n/rate;im=Image.new('RGBA',(960,540),'#090f22');d=ImageDraw.Draw(im)
  for x in range(0,960,48):d.line((x,130,x,450),fill='#121f37')
  for y in range(150,450,32):d.line((0,y,960,y),fill='#121f37')
  d.text((32,22),'BUNNY WARRIORS  /  FROST VFX LAB',font=small,fill='#ff6dad')
  d.text((32,48),kind.replace('_',' ').upper(),font=title,fill='#e7faff')
  d.text((32,90),'64 x 64 transparent sprites  |  Scripted mechanics illustration',font=small,fill='#819abf')
  cx=470+int(math.sin(t*.8)*75) if loop else 470;cy=295
  active=True
  if idx==0:
   local=t%3;frame=min(N-1,int(local/3*N));caption='25% SLOW / 2s  |  3 STACKS -> SHATTER';state=f'FROST CRACK  {min(3,int(local)+1)}/3'
  elif idx==1:
   local=t;active=1<=t<2.2;frame=min(N-1,max(0,int((t-1)*fps)));caption='2-TILE FIELD  |  NORMAL FOX FREEZE: 1.2s';state='FROZEN' if active else 'MOVING'
  else:
   active=t<7;frame=int(t*fps)%N;caption='7s TRACKING STORM  |  CASTER REMAINS MOBILE';state='STORM ACTIVE' if active else 'STORM ENDED'
  x=cx if idx!=1 or active else 470+int((t-2.2)*22 if t>2.2 else (t-1)*25)
  fox(im,x,cy,frozen=idx==1 and active)
  fox(im,755,300,boss=True)
  if active:
   sprite=effect(kind,frame,N).resize((192,192),Image.Resampling.NEAREST);im.alpha_composite(sprite,(cx-96,cy-108))
  d=ImageDraw.Draw(im);d.text((cx-65,365),state,font=small,fill='#9feeff');d.text((685,365),'BOSS: NEVER FROZEN',font=small,fill='#ffc27a')
  d.rectangle((0,445,960,540),fill='#10192e');d.text((30,463),caption,font=f,fill='#c4f7ff');d.text((30,499),'VFX prototype - no engine, damage, collision or balance validation',font=small,fill='#8296b7')
  proc.stdin.write(im.convert('RGB').tobytes())
 proc.stdin.close()
 if proc.wait():raise RuntimeError('ffmpeg failed')
 im.convert('RGB').save(R/kind/'preview.jpg')
print('Generated 64 frames, 3 sheets, 3 videos')
