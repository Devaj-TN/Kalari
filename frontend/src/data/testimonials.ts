import type { Testimonial } from '../types';

// Placeholder data — replace with Laravel API call later
const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: '1',
    name: 'Arjun Menon',
    role: 'Software Engineer',
    duration: '4 years student',
    quote:
      'Training at Kalari Academy completely transformed my body and mind. I came looking for fitness, but I found something far deeper — a living connection to an ancient tradition that still breathes with intensity. Gurukkal\'s teaching is patient, precise, and utterly demanding in the best way.',
    program: 'Meythari & Kolthari',
  },
  {
    id: '2',
    name: 'Priya Krishnan',
    role: 'Classical Dancer',
    duration: '2 years student',
    quote:
      'As a Bharatanatyam dancer, I was drawn to Kalari for its physical language. The training here reshaped how I understand my own body — the flexibility, the floor-level work, the explosive energy. My dancing is unrecognisable since I began here.',
    program: 'Foundation & Meythari',
  },
  {
    id: '3',
    name: 'Dr. Rajan Pillai',
    role: 'Physician',
    duration: 'Regular chikitsa patient',
    quote:
      'The Kalari Chikitsa treatments have been remarkable for my chronic back condition. Three years of physiotherapy achieved less than four sessions here. The marma work and herbal oil massage are genuinely extraordinary — this is medicine in its truest sense.',
    program: 'Kalari Chikitsa',
  },
  {
    id: '4',
    name: 'Meera Nambiar',
    role: 'School Teacher',
    duration: '1.5 years student',
    quote:
      'I joined the women\'s self-defense batch with zero experience. By the end, I had a level of physical confidence and body awareness I\'d never felt before. The instructors are exceptional — rigorous but deeply respectful.',
    program: "Women's Self-Defense",
  },
  {
    id: '5',
    name: 'Thomas Varghese',
    role: 'Parent',
    duration: "Child has trained 3 years",
    quote:
      'My son started kids\' Kalari at age seven. The discipline, focus, and respect he has developed in three years far exceeds anything school could have instilled. He is physically transformed and psychologically so much stronger.',
    program: "Kids' Kalari",
  },
];

export default TESTIMONIALS_DATA;
