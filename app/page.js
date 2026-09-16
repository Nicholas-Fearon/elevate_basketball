import {
  ArrowUpRight,
  ArrowRight,
  MoveUpRight,
  Sparkles,
  Heart,
  Users,
  CircleCheck,
  Dribbble,
} from "lucide-react";
import Camps from "@/components/camps";
import { SiteHeader, SiteFooter } from "@/components/header-footer";
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span /> MOVEMENT SKILLS. CONFIDENCE. ENJOYMENT.
            </div>
            <h1 className="literacy-headline">
              Developing
              <br />
              physical literacy
              <br />
              through <em>basketball.</em>
            </h1>
            <p>
              We use basketball and playful games to help young people build
              movement skills, confidence and a lasting love of being active.
            </p>
            <a href="#camps" className="button">
              Explore our camps <ArrowUpRight size={20} />
            </a>
            <div className="hero-note">
              <span className="mini-ball">
                <Dribbble size={21} />
              </span>{" "}
              For the joy of playing. For life.
            </div>
          </div>
          <div className="hero-visual">
            <div
              className="hero-image"
              role="img"
              aria-label="Young people playing basketball together on an outdoor court"
            />
            <div className="photo-shade" />
            <span className="photo-label">SMALL STEPS. BIG LEAPS.</span>
            <div className="hero-sticker">
              <MoveUpRight size={30} />
              <span>
                More play.
                <br />
                More possibility.
              </span>
            </div>
            <div className="photo-caption">
              <span>
                THE GAME IS JUST
                <br />
                THE BEGINNING.
              </span>
              <Dribbble size={47} strokeWidth={1.2} />
            </div>
          </div>
        </section>
        <div className="values-strip" aria-label="Our values">
          <span>MOVE WITH CONFIDENCE</span>
          <span aria-hidden="true">✳</span>
          <span>PLAY WITH PURPOSE</span>
          <span aria-hidden="true">✳</span>
          <span>GROW TOGETHER</span>
          <span aria-hidden="true">✳</span>
          <span>ENJOY THE JOURNEY</span>
        </div>
        <section id="approach" className="approach section-wrap">
          <div className="section-kicker">01 / THE ELEVATE APPROACH</div>
          <div className="approach-grid">
            <h2>
              Basketball is our tool.
              <br />
              <span>
                Physical literacy
                <br />
                is our purpose.
              </span>
            </h2>
            <div>
              <p className="mission">
                We believe physical literacy is about more than learning to move
                well, it's about building a positive relationship with movement
                that lasts a lifetime. At Elevate, we develop that relationship
                through basketball and fun, engaging games, so every young
                person finds their own reason to stay active.
              </p>
              <p className="secondary-copy">
                Running, stopping, balancing, jumping, throwing and catching:
                basketball gives young people opportunities to explore how they
                move. Games help them practise making decisions, working
                together and finding the confidence to try again.
              </p>
            </div>
          </div>
          <div className="principles">
            <article>
              <span className="principle-icon peach">
                <Sparkles size={24} />
              </span>
              <h3>Movement skills</h3>
              <p>
                Explore balance, coordination, jumping and catching through
                basketball and playful challenges.
              </p>
            </article>
            <article>
              <span className="principle-icon green">
                <Users size={24} />
              </span>
              <h3>Confidence to take part</h3>
              <p>
                Have a go, make decisions and learn alongside others in a game
                they can enjoy.
              </p>
            </article>
            <article>
              <span className="principle-icon yellow">
                <Heart size={24} />
              </span>
              <h3>Motivation to keep moving</h3>
              <p>
                Discover what makes movement enjoyable and build a positive
                relationship with being active.
              </p>
            </article>
          </div>
        </section>
        <section id="camps" className="camps-section section-wrap">
          <div className="section-kicker">02 / GET ON THE COURT</div>
          <div className="section-heading">
            <div>
              <h2>
                Good things start
                <br />
                with <span className="orange-text">a little play.</span>
              </h2>
              <p>Basketball camps with physical literacy at their heart.</p>
            </div>
            <div className="camp-note">
              <CircleCheck size={19} />
              <span>
                Come as you are.
                <br />
                Grow as you play.
              </span>
            </div>
          </div>
          <Camps />
        </section>
        <section className="closing section-wrap">
          <span className="closing-star" aria-hidden="true">
            ✳
          </span>
          <div>
            <p className="section-kicker">
              PHYSICAL LITERACY THROUGH BASKETBALL.
            </p>
            <h2>Let’s get them moving.</h2>
          </div>
          <a href="#camps" className="button button-light">
            Explore our camps <ArrowRight size={20} />
          </a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
