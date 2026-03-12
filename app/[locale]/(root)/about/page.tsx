import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Sparkles, Heart, Globe } from "lucide-react";

export default async function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/50 to-background">
      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-500 sm:hidden">
          <Link href="/">
            <Button
              variant="ghost"
              className="group hover:bg-purple-50 dark:hover:bg-purple-950/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="mb-16 animate-in fade-in slide-in-from-top-8 duration-1000">
          <Card className="relative overflow-hidden rounded-3xl border-none shadow-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 dark:from-purple-800 dark:via-pink-800 dark:to-purple-900">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-32 translate-y-32" />
            </div>

            <CardContent className="relative z-10 py-16 px-6 sm:px-12 text-center text-white">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Bukhara Suzani
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200 mt-2">
                    Ancient Art of Embroidery
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl leading-relaxed opacity-95 max-w-3xl mx-auto">
                  Discover the timeless beauty and rich cultural heritage of
                  Bukhara&quot;s most treasured craft
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
        <div className=" mb-10 mx-auto">
          <img
            src="/suzani.png"
            alt="Suzani"
            className="mb-10 rounded-md sm:h-[500px] w-full object-cover"
          />
          <strong>From Madrasa to Cinema to Suzani Embroidery</strong>
          <p className="">
            The vaulted room where Zarina Isomoa and her mother, Zaynab Murodova
            work used to be the cinema in Soviet times. It is a cool vaulted
            chamber, ideal for the blisteringly hot summers in Uzbekistan. It is
            a perfect space if you want to sew and sell embroidery. The two
            women practise the ancient skill of Uzbek embroidery –Suzani– in
            Bukhara, a walled city to the west of Samarkand, on the ancient Silk
            Road, where embroidered cloths, silks, spices, parchment, and wool
            would have been piled high on the camel caravans. The women have
            been in this location since 1991, when Uzbekistan became an
            independent republic. Before Soviet times, the room was a mosque in
            a Madrasa. In this collegiate institution, patrician young men would
            learn the Qu’ran, geometry, and algebra as part of their elite
            education. But now, the room is a women’s space, where their
            beautiful blankets, tablecloths, table runners, cushion covers,
            coats, scarves, and hangings are spread out in colourful abundance.
            Bounty and beauty. These decorative fabrics are also the substance
            of a woman’s dowry. The State has vowed to support and protect this
            traditional craft, along with others such as metalworking, miniature
            painting and wood carving.
          </p>
          <img
            src="/suzani-images.png"
            alt="Suzani"
            className="mb-10 rounded-md sm:h-[500px] w-full object-cover"
          />
          <p>
            People from all over the world come to watch Isomoa explain the
            technique in her clear and emphatic voice. She wears a light-blue
            headscarf, light blue denim jacket, and trousers, while her mother
            wears a traditional Uzbek floral long dress and head covering. As a
            third-generation embroiderer, she explains the stitching, the types
            of material used, and the pigments sourced for dyeing the thread
            while leaning on the cloths piled high. They are her wonder and
            prosperity. Passing the 3,000-year-old technique on and down through
            generations is crucial. Not only has Isomoa learned the skill from
            her mother, but she is also teaching her four-year-old daughter how
            to sew. Her ancestors were artists for the royal family, and her
            great-grandparents made costumes and decorative embroideries for the
            last king of Bukhara–Emir Alim Khan. Here, gender segregation
            thrives – while the men make the dyes, the women sew the silk and
            cotton, but the men sew the gold thread. We are in a land where
            borders have been violently contested, but a mix of languages has
            always prevailed. Suzani straddles two languages, as it derives from
            the Tajik/Persian language meaning needle. Isomoa explains the three
            kinds of fabric to sew on: one that is 100 percent silk; there is a
            thriving silk industry in Uzbekistan–there are lots of mulberry
            trees for the silkworms, another that is adras cloth, which is 50
            percent silk and 50 percent cotton, and the final fabric that is
            100% cotton. The material comes from the Fergana Valley, a fertile
            region southwest of Uzbekistan’s capital–Tashkent.
          </p>
          <img
            src="/suzani-images-1.png"
            alt="Suzani"
            className="mb-10 rounded-md sm:h-[500px] w-full object-cover"
          />

          <p>
            The skill of Suzani is intimately tied to one of the many charming
            domestic rituals witnessed in Uzbek society. A girl makes her first
            Suzani hang in her natal home, but when she gets married, it is
            transferred to her marital dwelling. That is if it is good enough.
            Not only does the embroidery become a symbol of her rite of passing,
            but her learnt skill and talent is transferable. And so the stitch
            ensures the continuity of marriage and sewing. Furthermore, the
            women stitch their wishes for the future into the embroidery, using
            colours such as blue, violet, pink, light yellow and red. There is
            raspberry for flowers such as carnations, tulips, and peonies, some
            with symbolic value: the pomegranate, made to look plump red and
            juicy for fertility; the chilli, curved and soft for love and the
            chilli pepper, red hot - for safeguarding against the “evil eye”.
            Sometimes, you might find an almond for health, and the colour blue
            is often found to reflect the colour of the stunning turquoise domes
            of the mosques, which have stood for centuries against the deep blue
            sky of the day. God is present everywhere. Above all, the evil eye
            is often stitched into a border to protect one and all. Beware the
            hook of the needle, which makes the eye. Beware the eye. Beware the
            power of the needle. In creating symbols through stitching, Zarina’s
            forebears tried to understand their place within the cosmos and so
            anchor their physical and emotional health. The embroidery threads
            its way to make a mark on society and underpins everyday religious
            practices and culture.
          </p>
          <img
            src="/suzani-image-2.png"
            alt="Suzani"
            className="mb-10 rounded-md sm:h-[500px] w-full object-cover"
          />
          <p>
            Compartments, borders, and patterns are crisscrossed and interlaced,
            just like the motifs in the local architecture. However, overall,
            there is no figurative imagery since the emphasis is on the
            decorative element. The dyes to make the threads colours come from
            various sources, such as walnuts, where the shell is boiled in a
            vat. Once the dye has been extracted, the nuts are eaten. Then there
            is the golden harmala plant, which grows in the desert. It was
            written about by the great Arabic scholar Ibn Sina, or Avicenna, a
            Bukhara local (980-1037CE). You can also smoke it to prevent
            infection. There are also locally sourced plants: pomegranate,
            turmeric for yellow, and madder root, boiled to make red; although
            indigo for the blue is bought in from Iran or India. The colours are
            bound together with a bit of alum, salt and vinegar. A large
            bedspread made out of silk and intricately embroidered took Isomoa’s
            mother eight months to create. The bedspread denotes happiness, for
            in the process of making, Isomoa says that the brain and body are
            both calm and happy. The family workshop is growing, and now they
            have thirty people involved in the work, so the “happy thread”
            continues, where women can feel part of a community.
          </p>
          <img
            src="/suzani-image-3.png"
            alt="Suzani"
            className="mb-10 rounded-md sm:h-[500px] w-full object-cover"
          />
          <p>
            Resisting entering the family tradition, which has stood for
            generations, would be to rebel. While there is a skill that can be
            taught, talent must surely be required in some small measure. And
            supposing only some generations have that? Would you want to be the
            one that breaks that bond or severs the connection of a skill that
            has such longevity and significance? This was not something you
            could question. Yet you can make a mistake as long as it is a
            deliberate mistake. Your stitchwork cannot be perfect, as only Allah
            creates it perfectly. When you draw out your complex design with
            borders and compartments, you make sure some feature needs to be
            aligned. In pride of place in the main living room, in a Uzbek
            woman&apos;s house, you see the pile of fabrics on a table or box at
            the heart of the household. You sleep, eat and relax with the
            embroidery. Tradition shared is tradition endured.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* History Section */}
          <Card className="rounded-3xl border border-border/50 shadow-xl bg-gradient-to-br from-card to-card/80 animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
            <CardContent className="p-8 sm:p-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mr-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Rich History
                </h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Bukhara Suzani represents one of the most sophisticated forms
                  of Central Asian textile art, with roots stretching back over
                  1,000 years. The word Suzani derives from the Persian suzan,
                  meaning needle, reflecting the intricate needlework that
                  defines this craft.
                </p>
                <p>
                  Historically, these magnificent textiles were created as part
                  of a bride&quot;s dowry, with mothers and daughters working
                  together for years to complete elaborate pieces that would
                  adorn the new household and serve as symbols of prosperity and
                  protection.
                </p>
                <p>
                  The city of Bukhara, once a major stop on the Silk Road,
                  became renowned for producing the finest Suzani textiles,
                  characterized by their bold floral motifs, vibrant colors, and
                  exceptional craftsmanship.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Craftsmanship Section */}
          <Card className="rounded-3xl border border-border/50 shadow-xl bg-gradient-to-br from-card to-card/80 animate-in fade-in slide-in-from-right-8 duration-1000 delay-500">
            <CardContent className="p-8 sm:p-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mr-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Master Craftsmanship
                </h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Each Bukhara Suzani is a masterpiece of hand embroidery,
                  created using silk threads on cotton or silk foundations. The
                  traditional chain stitch technique, passed down through
                  generations, creates the distinctive raised texture that makes
                  these textiles so remarkable.
                </p>
                <p>
                  Master artisans spend months, sometimes years, completing a
                  single large Suzani. The process begins with sketching
                  intricate patterns featuring pomegranates, roses, tulips, and
                  celestial motifs, each carrying deep symbolic meaning.
                </p>
                <p>
                  The vibrant colors - deep reds, brilliant blues, golden
                  yellows, and rich greens - are achieved using both natural and
                  carefully selected synthetic dyes, ensuring the textiles
                  maintain their beauty for generations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cultural Significance */}
        <Card className="rounded-3xl border border-border/50 shadow-xl bg-gradient-to-br from-card to-card/80 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
          <CardContent className="p-8 sm:p-12">
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Cultural Significance
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
                Beyond their aesthetic beauty, Bukhara Suzani textiles carry
                profound cultural and spiritual meaning
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Symbolic Motifs",
                  description:
                    "Pomegranates symbolize fertility and abundance, roses represent beauty and love, while celestial patterns offer protection and divine blessing.",
                },
                {
                  title: "Family Traditions",
                  description:
                    "Creating Suzani was a communal activity that strengthened family bonds, with techniques and patterns passed from mother to daughter across generations.",
                },
                {
                  title: "Spiritual Protection",
                  description:
                    "Many believe Suzani textiles possess protective qualities, bringing good fortune, health, and prosperity to households that display them.",
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Modern Relevance */}
        <Card className="rounded-3xl border border-border/50 shadow-xl bg-gradient-to-br from-card to-card/80 mb-16 animate-in fade-in slide-in-from-top-8 duration-1000 delay-900">
          <CardContent className="p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Preserving Heritage for Tomorrow
            </h2>
            <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed mb-8 max-w-4xl mx-auto">
              Today, Bukhara Suzani continues to captivate collectors and
              interior designers worldwide. By supporting authentic Suzani
              artisans, we help preserve this ancient craft while providing
              sustainable livelihoods for traditional craftspeople in
              Uzbekistan.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
              Each piece in our collection represents not just exquisite
              artistry, but a living connection to centuries of cultural
              heritage, making every Suzani a treasured heirloom for future
              generations.
            </p>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1100">
          <Link href="/">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Explore Our Collection
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
