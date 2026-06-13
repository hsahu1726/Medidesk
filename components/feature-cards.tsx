import Link from "next/link";
import { Upload, Pill, FileText, Calendar } from "lucide-react";


export default function FeatureCards() {
  const features = [
    {
      title: 'MediSnap',
      subtitle: 'Medicine Scanner',
      description: 'Upload a photo of a medicine strip or bottle to get detailed information.',
      features: [
        'Brand & salt name',
        'Usage & indications',
        'Typical dose range',
        'Best time to take',
        'Compatibility info',
        'Common side effects'
      ],
      icon: Pill,
      color: 'primary'
    },
    {
      title: 'Prescription Reader',
      description: 'Upload a photo of your doctor\'s prescription to get a clean medicine schedule.',
      features: [
        'Reads handwriting',
        'Extracts medicine names',
        'Dose information',
        'Frequency & timing',
        'Clean schedule format',
        'Easy to follow'
      ],
      icon: FileText,
      color: 'accent'
    }
  ];

  return (
    <section id="features" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
          Powerful Features for <span className="text-primary">Better Health</span>
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
          Two intelligent tools to manage your medicines smarter
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const isAccent = feature.color === 'accent';
            return (
              <div
                key={idx}
                className={`rounded-2xl p-8 border transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  isAccent
                    ? 'bg-accent/5 border-accent/30 hover:border-accent/50'
                    : 'bg-primary/5 border-primary/30 hover:border-primary/50'
                }`}
              >
                <div className={`inline-flex p-4 rounded-lg mb-6 ${
                  isAccent ? 'bg-accent/20' : 'bg-primary/20'
                }`}>
                  <Icon className={`w-8 h-8 ${isAccent ? 'text-accent' : 'text-primary'}`} />
                </div>

                <h3 className="text-2xl font-bold mb-2 text-foreground">{feature.title}</h3>
                {feature.subtitle && (
                  <p className={`text-sm font-semibold mb-3 ${isAccent ? 'text-accent' : 'text-primary'}`}>
                    {feature.subtitle}
                  </p>
                )}
                <p className="text-muted-foreground mb-6">{feature.description}</p>

                <div className="space-y-3 mb-8">
                  {feature.features.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isAccent ? 'bg-accent' : 'bg-primary'}`}></div>
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
  href={feature.title === "MediSnap" ? "#medisnap" : "#prescription"}
  className="block"
>
  <button
    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
      isAccent
        ? "bg-accent/20 text-accent hover:bg-accent/30"
        : "bg-primary/20 text-primary hover:bg-primary/30"
    }`}
  >
    <Upload className="w-4 h-4 inline mr-2" />
    Upload Now
  </button>
</Link>

              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
          <div className="flex items-start gap-4 mb-4">
            <Calendar className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-xl font-bold text-foreground mb-2">Google Calendar Integration</h4>
              <p className="text-muted-foreground">
                Next to each medicine in your schedule, click the "Add reminder to Google Calendar" button. Your medicine reminders will appear directly in your Google Calendar with pre-filled details.
              </p>
            </div>
          </div>
          <a
  href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=MEDICINE+TIME&details=Medicine+reminder+created+from+MediDesk.+Set+your+own+time+and+repeat+schedule."
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
>
  Connect Google Calendar
</a>

        </div>
      </div>
    </section>
  );
}
