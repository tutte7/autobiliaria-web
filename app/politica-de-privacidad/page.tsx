import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsappCTA from "@/components/whatsapp-cta"

const paragraphs = {
  aceptacion:
    "El servicio de publicación de avisos de venta de automotores de Autobiliaria en su carácter de responsable de la operación y explotación del sitio autobiliaria.com a los anunciantes y/o usuarios (en adelante individualmente el Usuario y genéricamente los Usuarios) que accedan y se registren en el Sitio a fines de proceder con una o más publicaciones, con la condición de que acepten sin ninguna objeción todos y cada uno de los TERMINOS Y CONDICIONES que se describen a continuación. Asimismo, debido a que ciertos contenidos que puedan ser accedidos a través del Sitio podrán estar alcanzados por normas específicas que reglamenten y complementen a los presentes TyC, se recomienda a los Usuarios tomar conocimiento específico de ellas a través del sitio www.autobiliaria.com.",
  alcance:
    "Fuera de lo estipulado en la última parte del apartado precedente, los presentes TyC y las normas que los complementan sólo serán aplicables a los servicios y contenidos prestados y/o accesibles directamente en el Sitio y no a aquellos a los que los Usuarios puedan acceder a través de un hipervínculo (link), una barra co-branded, y/o cualquier otra herramienta de navegación ubicada en el Sitio que los lleve a navegar un recurso diferente. La probable aparición de dichos links en el Sitio no implica de modo alguno la asunción de garantía por parte de autobiliaria.com sobre los productos, servicios, o programas contenidos en ninguna página vinculada al Sitio por tales links. Deslinda toda responsabilidad por el contenido de las mismas. En atención a ello, la utilización de los links para navegar hacia cualquier otra página queda al exclusivo criterio y riesgo de los Usuarios.",
  ingreso:
    "A fin de publicar un aviso clasificado a través del Sitio, el Usuario deberá registrarse e ingresar de manera correcta sus datos personales, así como el texto, fotos y demás información del aviso que pretende publicar. El Usuario deberá aceptar la totalidad de las condiciones de contratación. Autobiliaria.com podrá realizar un control del mismo, procediendo, entre otros criterios, a la revisión de su contenido e incluso a su remoción del Sitio si su contenido no se correspondiere con estos TyC. Reconocen y aceptan los Usuarios que sólo podrán publicarse aquellos automotores cuyas características se encuentren contenidas en los nomencladores de marcas, modelos y versiones bajo los cuales opera el Sitio.",
  publicacion:
    "Cumplidos los requisitos del apartado anterior, Autobiliaria.com publicará los avisos en el Sitio por treinta (30) días, pudiendo ser los mismos modificados (excepto la información de marca, modelo y año de fabricación) y/o dados de baja por el Usuario.",
  calidad:
    "El Sitio no manifiesta ni garantiza de modo alguno que no existan otros productos en el mercado, incluso más convenientes, en precio o condiciones, como así tampoco que no existan otros productos que cumplan la misma función que los publicados en el Sitio. En consecuencia, Autobiliaria.com sugiere firmemente que la información brindada por el Sitio respecto de los productos publicados, sea objeto de una investigación independiente y propia de quien está interesado en la misma, no asumiendo ningún tipo de responsabilidad por la incorrección de la información, su desactualización o falsedad. Autobiliaria.com no asume ninguna obligación respecto del Usuario y/o los visitantes en general y se limita tan sólo a publicar en el Sitio en forma similar a aquella en que lo haría una guía telefónica o la sección clasificados de un periódico impreso, los datos de los Usuarios proveedores de productos o servicios que han solicitado tal publicación y en la forma en que tales datos han sido proporcionados por tales Usuarios.",
  espacio:
    "Autobiliaria.com tiene la libre facultad de establecer y modificar la cantidad de espacio mínimo y máximo de MB que el Usuario oferente puede utilizar, para publicar los avisos clasificados en el Sitio.",
  baseDatos:
    "Autobiliaria se compromete a no ceder, vender, ni entregar a otras empresas o personas físicas, la información suministrada por los Usuarios. Los Usuarios aceptan por el hecho de registrarse como tales en el Sitio, el derecho de autobiliaria de comunicarse con ellos en forma telefónica o vía electrónica; ello, hasta tanto los Usuarios hagan saber su decisión en contrario por medio fehaciente.",
  responsabilidad:
    "Los Usuarios aceptan y reconocen que autobiliaria no será responsable, contractual o extracontractualmente, por ningún daño o perjuicio, directo o indirecto, derivado de la utilización del Servicio.",
  indemnidad:
    "Los Usuarios asumen total responsabilidad frente a autobiliaria y a terceros por los daños y/o perjuicios de toda clase que se generen como consecuencia del uso del Servicio, debiendo indemnizar y mantener indemne a autobiliaria y a terceros ante cualquier reclamo (incluyendo honorarios profesionales) que pudiera corresponder en los supuestos indicados.",
  modificacion:
    "Autobiliaria se reserva el derecho a modificar el Servicio, los TyC y las normas que los complementan, en cualquier momento y cuantas veces lo crea conveniente, sin necesidad de notificar en forma previa a los Usuarios.",
  leyAplicable:
    "Los presentes TyC y las normas que lo complementan, constituyen un acuerdo legal entre los Usuarios y autobiliaria.com, al cual le serán aplicadas las leyes de la República Argentina, siendo competentes para cualquier controversia que pudiere llegar a suscitarse, los tribunales nacionales en lo comercial, con asiento en la Ciudad de Mar del Plata, provincia de Buenos Aires. La utilización del Servicio está expresamente prohibida en toda jurisdicción en donde no puedan ser aplicadas las condiciones establecidas en los presentes TyC. Si los Usuarios utilizan el Servicio, significa que han leído, entendido y acordado las normas antes expuestas. Si no están de acuerdo con ellas, tienen la opción de no utilizar el Servicio. Toda notificación u otra comunicación que deba efectuarse bajo estos TyC, deberá realizarse por escrito: (i) al Usuario: a la cuenta de correo electrónico por él ingresada o por carta documento dirigida al domicilio declarado en su ficha de registración o (ii) a autobiliaria a la cuenta de correo electrónico info@autobiliaria.com o a Falucho 1323, Ciudad de Mar del Plata (7600).",
}

const userAgreementPoints = [
  "La utilización del Servicio es a su solo riesgo.",
  "Autobiliaria.com no será responsable por ningún daño o perjuicio directo o indirecto, incluyendo, sin ningún tipo de limitación, daños producidos por la pérdida o deterioro de información.",
  "Los Usuarios son los únicos responsables de los contenidos de la información que se publica a través del Servicio.",
  "Autobiliaria.com se reserva el derecho a terminar el Servicio.",
  "El Servicio puede no siempre estar disponible debido a dificultades técnicas o fallas de Internet, o por cualquier otro motivo ajeno a autobiliaria, motivo por el cual no podrá imputársele a autobiliaria responsabilidad alguna.",
  "El contenido de las distintas pantallas del Sitio, junto con y sin que se considere una limitación, sus programas, bases de datos, redes y archivos, son de propiedad de autobiliaria. Su uso indebido así como su reproducción no autorizada podrá dar lugar a las acciones judiciales que correspondan.",
  "La utilización del Servicio no podrá, en ningún supuesto, ser interpretada como una autorización y/o concesión de licencia para la utilización de los derechos intelectuales de autobiliaria y/o de un tercero.",
  "La utilización de Internet en general y del Sitio en particular, implica la asunción de riesgos de potenciales daños al software y al hardware del Usuario. Por tal motivo, el equipo terminal desde el cual acceda al Sitio el Usuario, estará en condiciones de resultar atacado y dañado por la acción de hackers quienes podrán incluso acceder a la información contenida en el equipo terminal del Usuario, extraerla, sustraerla y/o dañarla. Paralelamente, el intercambio de información a través de Internet tiene el riesgo de que tal información pueda ser captada por un tercero. autobiliaria no se hace responsable de las consecuencias que pudiera acarrear al Usuario tal hipótesis.",
  "Autobiliaria.com no guarda obligación alguna de conservar información que haya hecho disponible a los Usuarios, ni que le haya sido enviada por éstos últimos.",
]

export default function PoliticaDePrivacidadPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,232,255,0.32),rgba(1,136,200,0.85)_40%,rgba(1,46,99,1)_100%)] pt-32 pb-24 text-white">
        <div className="absolute -left-20 top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-28 bottom-0 h-64 w-64 rounded-full bg-primary/30 blur-[120px]" aria-hidden="true" />

        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Política de privacidad
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">Compromiso con tu privacidad</h1>
              <p className="text-base text-white/85 md:text-lg">
                Esta política resume cómo Autobiliaria.com protege la información personal de los usuarios, la utilización de nuestros servicios y los alcances legales de cada interacción en el sitio.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
                Vigencia 2006 - 2026
              </div>
              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
                Normas de confidencialidad
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
            <div className="space-y-3 text-sm text-white/85">
              <p className="font-semibold text-white">Lectura recomendada</p>
              <p>
                Te sugerimos revisar este documento cada vez que utilices nuestros servicios para conocer actualizaciones, responsabilidades y obligaciones vinculadas a tu cuenta.
              </p>
              <p className="text-xs text-white/70">
                Ante cualquier consulta, escribinos a <span className="font-semibold">info@autobiliaria.com</span> o visitanos en Falucho 1323, Mar del Plata.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mt-12 rounded-[32px] border border-border bg-card/80 p-8 shadow-sm md:p-12">
            <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
              <header className="space-y-3 border-b border-border pb-6 text-foreground">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">Política de privacidad</p>
                <h2 className="text-3xl font-semibold">Términos y condiciones de uso</h2>
                <p className="text-sm text-muted-foreground">
                  Última actualización: 2006 - 2026 autobiliaria.com | All Rights Reserved - Normas de Confidencialidad y Privacidad
                </p>
              </header>

              <section className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Aceptación de los términos y condiciones</h3>
                <p>{paragraphs.aceptacion}</p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Alcance de los TyC</h3>
                <p>{paragraphs.alcance}</p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Ingreso y publicación de clasificados</h3>
                <p>{paragraphs.ingreso}</p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Publicación en el sitio web</h3>
                <p>{paragraphs.publicacion}</p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Calidad de los productos promocionados</h3>
                <p>{paragraphs.calidad}</p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Espacio asignado en el servicio</h3>
                <p>{paragraphs.espacio}</p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Base de datos</h3>
                <p>{paragraphs.baseDatos}</p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Responsabilidad</h3>
                <p>{paragraphs.responsabilidad}</p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Indemnidad</h3>
                <p>{paragraphs.indemnidad}</p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Modificación del servicio o de los TyC</h3>
                <p>{paragraphs.modificacion}</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Los usuarios expresamente comprenden y están de acuerdo en que</h3>
                <ul className="list-disc space-y-3 pl-6">
                  {userAgreementPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Ley aplicable y tribunal competente</h3>
                <p>{paragraphs.leyAplicable}</p>
              </section>

              <footer className="border-t border-border pt-6 text-xs text-muted-foreground">
                <p>2006 - 2026 autobiliaria.com | All Rights Reserved - Normas de Confidencialidad y Privacidad</p>
              </footer>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsappCTA />
    </main>
  )
}


