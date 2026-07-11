import { parse } from 'yaml';
import resumeSource from '../content/data/resume.yaml?raw';

export function getResume() {
  const [resume] = parse(resumeSource);

  return resume;
}