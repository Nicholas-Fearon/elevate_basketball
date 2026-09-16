import { ArrowUpRight } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/header-footer';
export const metadata = {
  title: 'For schools | Physical literacy through basketball | Elevate Basketball',
  description: 'Explore Elevate Basketball’s KS1 and KS2 school offer: a downloadable curriculum in development and school sessions during curriculum time, breakfast clubs or after-school clubs.',
};
export default function SchoolsPage() {
  return <><SiteHeader /><main className="schools-page section-wrap">
    <p className="section-kicker">ELEVATE BASKETBALL / FOR KS1 &amp; KS2</p>
    <h1>Basketball learning.<br /><span className="orange-text">A purpose beyond the court.</span></h1>
    <p className="school-lead">Give Key Stage 1 and Key Stage 2 pupils opportunities to develop movement skills, build confidence and discover enjoyment in being active. Elevate uses basketball as the tool, with physical literacy at the heart of the learning.</p>
    <a href="#school-options" className="button">Explore the two options <ArrowUpRight size={20} /></a>

    <section id="school-options" className="school-section">
      <p className="section-kicker">TWO WAYS TO WORK WITH ELEVATE</p>
      <h2>A curriculum for your school.<br />Or sessions delivered by Elevate.</h2>
      <div className="school-learning school-options">
        <article><span className="school-status">Curriculum in development</span><h3>Download the curriculum</h3>
          <p>A curriculum for KS1 and KS2 that you will be able to purchase and download directly from this website, for your school to use in its own setting.</p>
          <p>The focus: developing physical literacy through basketball, connecting movement skills with confidence, motivation and understanding.</p>
          <p><strong>Not yet available to purchase or download.</strong> Contents, pricing and release details will be shared as the curriculum develops.</p>
          <a href="mailto:elevatebasketballcoaching@gmail.com?subject=KS1%20and%20KS2%20curriculum%20enquiry" className="school-hero-link">Ask about the curriculum <ArrowUpRight size={17} /></a>
        </article>
        <article><span className="school-status">School delivery</span><h3>Bring Elevate into your school</h3>
          <p>Elevate can come into your school to deliver basketball sessions for KS1 and KS2 pupils, bringing our physical literacy approach into the school day or wraparound provision.</p>
          <ul><li>During curriculum time</li><li>Breakfast club</li><li>After-school club</li></ul>
          <p>Enquire to discuss your pupils, setting, preferred times and delivery requirements. Availability and costs are agreed directly.</p>
          <a href="mailto:elevatebasketballcoaching@gmail.com?subject=School%20basketball%20sessions%20enquiry" className="school-hero-link">Discuss school sessions <ArrowUpRight size={17} /></a>
        </article>
      </div>
    </section>

    <section className="school-section">
      <p className="section-kicker">WHAT WE MEAN BY PHYSICAL LITERACY</p>
      <h2>How pupils move.<br />And how they feel about moving.</h2>
      <p>At Elevate, physical literacy means helping young people build a positive, lasting relationship with movement — through sport and games they actually enjoy.</p>
      <p>Our educational focus brings together four connected areas. Basketball creates opportunities to explore them in the same activity, with each pupil bringing their own experience, interests and starting point.</p>
      <div className="school-learning">
        <article><h3>Movement skills</h3><p>Running, stopping, balancing, changing direction, throwing and catching. Pupils can explore how to control their movement and use it in a game.</p></article>
        <article><h3>Confidence</h3><p>Feeling able to join in, try a challenge and learn from a mistake. Success can mean having another go, contributing to a team or trying something new.</p></article>
        <article><h3>Motivation and enjoyment</h3><p>Discovering activities that feel worthwhile and enjoyable. Choice, play and a sense of belonging can help pupils find their own reasons to take part.</p></article>
        <article><h3>Knowledge and understanding</h3><p>Reading a situation, choosing an action and reflecting on it. Pupils can explore why a pass worked, how to make space and what helps them feel ready to participate.</p></article>
      </div>
      <p>Physical literacy develops across a lifetime of movement experiences. Our aim is to contribute positively to that journey through basketball.</p>
      <p className="literacy-source">Read more about the concept in <a href="https://www.sportengland.org/news-and-inspiration/physical-literacy-consensus-statement-england-published">Sport England’s physical literacy consensus statement</a> and the <a href="https://www.physical-literacy.org.uk/about/faqs/">International Physical Literacy Association’s guidance</a>.</p>
    </section>

    <section className="school-section">
      <p className="section-kicker">AN EXAMPLE OF THE APPROACH</p>
      <h2>Make a pass. Make a decision.<br />Find a reason to try again.</h2>
      <p>In a small-sided passing game, pupils might practise moving into space and receiving a ball. They also choose who to pass to, communicate with teammates and experience what it feels like to contribute.</p>
      <p>Changing the ball, playing area or level of challenge offers ways to adapt the activity. A short reflection — “What helped you join in?” or “What would you try next?” — can connect the experience with pupils’ confidence and understanding.</p>
      <p>This example shows how movement, confidence and understanding can be explored together through a basketball activity.</p>
    </section>

    <section className="school-section school-faq">
      <h2>Questions from schools.</h2>
      <details><summary>Can we download the curriculum now?</summary><p>Not yet. The curriculum is in development. The plan is to make it available to purchase and download here once it is ready, with clear information about its contents and how to use it with KS1 and KS2 pupils.</p></details>
      <details><summary>Can Elevate deliver sessions at our school?</summary><p>Yes. You can enquire about sessions during curriculum time, breakfast club or after-school club. We will discuss your requirements and confirm availability, suitability and costs with you.</p></details>
      <details><summary>Is this focused on basketball skills or physical literacy?</summary><p>Basketball is the activity we use. Movement skills sit alongside confidence, motivation and understanding, so the educational purpose extends beyond technique or match results.</p></details>
      <details><summary>Which pupils is the offer suitable for?</summary><p>Our school offer is for Key Stage 1 (KS1) and Key Stage 2 (KS2). Tell us your pupils’ year groups and any participation or support needs when you enquire so we can discuss your school’s requirements.</p></details>
      <details><summary>What is included, and how much does it cost?</summary><p>The downloadable curriculum’s contents and price are still being developed. School delivery is discussed separately, based on your requirements. Enquiring does not commit your school to a purchase.</p></details>
    </section>

    <section id="school-enquiries" className="school-section">
      <p className="section-kicker">LET’S TALK ABOUT YOUR SCHOOL</p>
      <h2>Start with your pupils.</h2>
      <p>Let us know your school name and location, year groups, approximate pupil numbers and whether you are interested in the curriculum or sessions delivered by Elevate. For sessions, include your preferred days and whether you need curriculum time, breakfast club or after-school provision.</p>
      <a className="button" href="mailto:elevatebasketballcoaching@gmail.com?subject=Elevate%20Basketball%20school%20enquiry">Email us about your school <ArrowUpRight size={20} /></a>
      <p>You can also email <a style={{textDecoration:'underline',overflowWrap:'anywhere'}} href="mailto:elevatebasketballcoaching@gmail.com">elevatebasketballcoaching@gmail.com</a>.</p>
    </section>
  </main><SiteFooter /></>;
}
