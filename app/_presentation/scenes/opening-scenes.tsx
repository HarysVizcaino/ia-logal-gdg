import { ArrowDown, BrainCircuit, Camera, Cloud, Cpu, Laptop, Music2, Server, UserRound } from "lucide-react";
import Image from "next/image";

import { presentationConfig } from "../presentation-config";
import { SceneHeader } from "./section-one-scenes";

export function OpeningHoldScreen() {
  const { speaker, showWaitingMessage } = presentationConfig;

  return (
    <section className="scene opening-hold-screen">
      <div className="opening-devfest-brand" aria-label="Google Developer Groups Santo Domingo">
        <Image src="/brand/gdg-icon.svg" alt="" width={72} height={40} priority />
        <span><strong>Google Developer Groups</strong><small>Santo Domingo</small></span>
      </div>
      <div className="opening-track-badge" aria-label="IA en DevFest Santo Domingo">
        <span>IA <b>@DevFest</b></span><small>Santo Domingo</small>
      </div>
      <div className="opening-network" aria-hidden>
        <i /><i /><i /><i /><i /><i />
        <span /><span /><span /><span />
      </div>
      <div className="opening-location-rail" aria-hidden>
        <div><Laptop /><span>Local</span></div><b /><div><Cloud /><span>Cloud</span></div>
      </div>
      <div className="opening-title-block">
        <span className="opening-eyebrow">Presentación en vivo · 40 minutos</span>
        <h1>IA Local,<br />Home Labs y<br /><em>Tokens “Infinitos”</em></h1>
        <p>Modelos locales, infraestructura propia y cuándo dejar de depender de la nube</p>
      </div>
      <div className="opening-speaker-line">
        <span>Speaker</span><strong>{speaker.name}</strong><i /> <span>{speaker.role}</span>
      </div>
      {showWaitingMessage ? <div className="opening-waiting"><i /><span>Comenzamos en unos minutos</span></div> : null}
      <div className="opening-begin-hint">Space · Enter · → para comenzar</div>
    </section>
  );
}

const speakerHighlights = [
  "+10 años construyendo software",
  "IA, automatización y productos con AI",
  "Creador de contenido sobre software, IA y Home Labs",
] as const;

function SpeakerPhoto() {
  const { image, name } = presentationConfig.speaker;

  return (
    <div className="speaker-photo" data-has-image={Boolean(image)}>
      {image ? <Image src={image} alt={`Retrato de ${name}`} fill sizes="42vw" priority /> : <div className="speaker-photo-placeholder"><UserRound aria-hidden /><strong>HV</strong><span>Software · AI · Home Labs</span></div>}
      <div className="speaker-photo-tech" aria-hidden><Cpu /><BrainCircuit /><Server /></div>
    </div>
  );
}

export function SpeakerIntroductionScene() {
  const { speaker } = presentationConfig;

  return (
    <section className="scene section-scene speaker-introduction-scene">
      <SceneHeader number="00" kicker="Presentación del ponente" title="Hola, soy Harys" />
      <div className="speaker-introduction-layout">
        <SpeakerPhoto />
        <div className="speaker-profile">
          <div className="speaker-name"><span>Speaker</span><h2>{speaker.name}</h2><strong>{speaker.role}</strong></div>
          <div className="speaker-highlights">{speakerHighlights.map((item, index) => <article key={item} style={{ animationDelay: `${index * 90}ms` }}><span>0{index + 1}</span><p>{item}</p></article>)}</div>
          <blockquote>“Me gusta experimentar con IA no solo como usuario, sino entendiendo qué pasa cuando la llevamos a nuestro propio hardware.”</blockquote>
          <div className="speaker-socials">
            <span><Camera aria-hidden /><small>Instagram</small><strong>{speaker.instagram}</strong></span>
            <span><Music2 aria-hidden /><small>TikTok</small><strong>{speaker.tiktok}</strong></span>
          </div>
        </div>
      </div>
      <div className="speaker-transition"><span>Hoy quiero que respondamos tres preguntas</span><ArrowDown aria-hidden /><strong>Empecemos por algo que usamos todos los días.</strong></div>
    </section>
  );
}
