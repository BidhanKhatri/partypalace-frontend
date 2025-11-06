import React from "react";
import {
  MessageSquare,
  Send,
  Star,
  Users,
  CheckCircle,
  Lightbulb,
  Bug,
} from "lucide-react";

const FeedbackPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pt-20">
      {/* Orange gradient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-600/20 via-orange-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute -top-32 left-1/3 w-80 h-80 bg-gradient-to-b from-orange-700/15 to-transparent rounded-full blur-3xl"></div>

      {/* Grid Background */}
      <div className="absolute inset-0 opacity-40">
        <svg
          className="w-full h-full"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="smallGrid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="rgba(251, 146, 60, 0.3)"
                strokeWidth="0.7"
              />
            </pattern>
            <pattern
              id="grid"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <rect width="100" height="100" fill="url(#smallGrid)" />
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke="rgba(249, 115, 22, 0.4)"
                strokeWidth="1.2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Radial Gradient Accents */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute top-1/3 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, transparent 70%)",
          }}
        ></div>
        <div
          className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(71, 85, 105, 0.06) 0%, transparent 70%)",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Hero Section with Image */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="text-center md:text-left">
              <div className="inline-block mb-4 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full">
                <p className="text-xs sm:text-sm font-medium text-slate-300 tracking-wide uppercase">
                  Help Us Improve
                </p>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Your Feedback Shapes Our Future
              </h1>

              <p className="text-base sm:text-lg text-slate-400 font-light leading-relaxed mb-8">
                We're committed to delivering the best experience. Share your
                thoughts, suggestions, and ideas to help us grow and evolve.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                  href="https://nabinnepali.app.n8n.cloud/form/63f43d6f-3bf5-4af4-81f0-ced071690f41"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-950 shadow-lg"
                >
                  <Send className="inline-block mr-2 w-5 h-5" />
                  Share Your Feedback
                </a>
              </div>
            </div>

            {/* Image Section */}
            <div className="hidden md:block relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 backdrop-blur-xl bg-slate-900/40">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop"
                  alt="Team collaboration and feedback"
                  className="w-full h-auto object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-40"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            Why Your Feedback Matters
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:border-orange-500/30 transition duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-2.5 mb-4 group-hover:scale-110 transition">
                <Star className="w-full h-full text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Your Voice Matters
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Every piece of feedback directly influences our product roadmap
                and feature prioritization.
              </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:border-orange-500/30 transition duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-2.5 mb-4 group-hover:scale-110 transition">
                <Lightbulb className="w-full h-full text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Quick & Easy
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Share your thoughts in just a few minutes with our streamlined
                feedback form.
              </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8 hover:border-orange-500/30 transition duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-2.5 mb-4 group-hover:scale-110 transition">
                <Users className="w-full h-full text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Community Driven
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Join thousands of users actively shaping the future of our
                platform.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Types */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            What Can You Share?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-5 hover:border-orange-500/30 transition">
              <div className="flex items-center gap-3 mb-3">
                <Bug className="w-5 h-5 text-orange-500" />
                <h4 className="font-semibold text-white">Bug Reports</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Found something not working? Let us know the details.
              </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-5 hover:border-orange-500/30 transition">
              <div className="flex items-center gap-3 mb-3">
                <Lightbulb className="w-5 h-5 text-orange-500" />
                <h4 className="font-semibold text-white">Feature Ideas</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Have a brilliant idea? Share it with us today.
              </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-5 hover:border-orange-500/30 transition">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-orange-500" />
                <h4 className="font-semibold text-white">Suggestions</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Think we can improve something? Let us know.
              </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-5 hover:border-orange-500/30 transition">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="w-5 h-5 text-orange-500" />
                <h4 className="font-semibold text-white">General Feedback</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Share your overall experience with us.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-orange-600/20 to-orange-500/10 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-slate-300 mb-8 text-lg leading-relaxed">
              Your feedback helps us build a better product for everyone. We're
              listening and eager to hear from you.
            </p>
            <a
              href="https://nabinnepali.app.n8n.cloud/form/63f43d6f-3bf5-4af4-81f0-ced071690f41"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-10 rounded-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-950 shadow-lg hover:shadow-xl"
            >
              Open Feedback Form
            </a>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center pb-10">
          <p className="text-slate-500 text-sm">
            Thank you for being part of our journey! Your feedback drives our
            innovation. 🙏
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
