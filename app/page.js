import {
  ArrowUpRight,
  ArrowRight,
  MoveUpRight,
  Sparkles,
  Heart,
  Users,
  CircleCheck,
  Dribbble,
  Lightbulb,
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
            <a className="school-hero-link" href="/schools/">For schools: curriculum and school sessions <ArrowRight size={17} /></a>
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
                At Elevate, physical literacy means helping young people build a
                positive, lasting relationship with movement — through sport and
                games they actually enjoy.
              </p>
              <p className="secondary-copy">
                That relationship includes the skills to move, the confidence to
                participate, the motivation to return, and the understanding to
                make choices. Basketball gives us opportunities to bring these
                together: moving into space, choosing a pass, supporting a teammate
                and discovering what makes a game enjoyable.
              </p>
            </div>
          </div>
          <div className="principles literacy-principles">
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
            <article>
              <span className="principle-icon green"><Lightbulb size={24} /></span>
              <h3>Knowledge and understanding</h3>
              <p>Notice what works, explain a choice and explore how movement feels.
                Learning includes thinking about the game as well as playing it.</p>
            </article>
          </div>
          <div className="literacy-example">
            <div><p className="section-kicker">WHAT THAT CAN LOOK LIKE</p><h3>One passing game.<br />Many ways to learn.</h3></div>
            <div><p>A small-sided passing game can invite pupils to move into space,
              control a catch and decide when to pass. Changing the space, ball or
              challenge can offer different ways to take part.</p>
              <p>Reflection makes the learning visible: “What helped you receive the
              ball?”, “When did you feel confident?” and “What would you try next?”</p>
              <p className="secondary-copy">This is an illustration of our approach.
              Physical literacy develops over time and across many experiences;
              a basketball session is one opportunity to support that journey.</p></div>
          </div>
          <p className="literacy-source">Explore the wider idea in <a href="https://www.sportengland.org/news-and-inspiration/physical-literacy-consensus-statement-england-published">Sport England’s physical literacy consensus statement</a>.</p>
        </section>
        <section id="schools" className="school-intro section-wrap">
          <p className="section-kicker">FOR SCHOOLS / CURRICULUM &amp; DELIVERY</p>
          <div className="approach-grid"><div><h2>Bring purpose<br />to every <span className="orange-text">game.</span></h2></div>
            <div><p className="mission">For KS1 and KS2: a downloadable curriculum in development, and basketball sessions delivered in your school.</p><p className="secondary-copy">Explore two ways to bring physical literacy through basketball to your pupils: a curriculum for your school to use, or Elevate-led sessions during curriculum time, breakfast club or after-school club.</p>
              <a className="button school-link" href="/schools/">Explore our school offer <ArrowUpRight size={20} /></a>
            </div></div>
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
