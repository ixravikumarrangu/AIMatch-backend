import re
import json
from typing import Set, List

# Reverse lookup: synonym -> canonical skill
SKILL_MAP = {}

# Canonical skill is ALWAYS at index 0
TO_STORE = [

    # =========================
    # Frontend
    # =========================
    ["javascript", "javascript", "js", "ecmascript"],
    ["typescript", "typescript", "ts"],
    ["react", "react", "reactjs", "react.js"],
    ["angular", "angular", "angularjs"],
    ["vue", "vue", "vuejs", "vue.js"],
    ["svelte", "svelte", "sveltejs"],
    ["nextjs", "nextjs", "next.js"],
    ["nuxtjs", "nuxtjs", "nuxt.js"],
    ["redux", "redux", "redux toolkit"],
    ["zustand", "zustand"],
    ["webpack", "webpack"],
    ["vite", "vite"],
    ["babel", "babel"],
    ["frontend_development", "frontend development", "ui development"],

    # =========================
    # Web / UI
    # =========================
    ["html", "html", "html5"],
    ["css", "css", "css3"],
    ["sass", "sass", "scss"],
    ["bootstrap", "bootstrap", "bootstrap framework"],
    ["tailwind", "tailwind", "tailwindcss"],
    ["material_ui", "material ui", "mui"],
    ["responsive_design", "responsive design"],
    ["web_accessibility", "accessibility", "a11y"],

    # =========================
    # Backend
    # =========================
    ["nodejs", "node", "nodejs", "node.js"],
    ["express", "express", "express.js"],
    ["nestjs", "nestjs", "nest.js"],
    ["spring", "spring", "spring framework"],
    ["spring_boot", "spring boot", "springboot"],
    ["django", "django"],
    ["flask", "flask"],
    ["fastapi", "fastapi"],
    ["laravel", "laravel"],
    ["dotnet", ".net", "dotnet", "asp.net"],
    ["hibernate", "hibernate"],
    ["graphql", "graphql"],
    ["rest_api", "rest api", "restful services"],
    ["microservices", "microservices", "microservice architecture"],
    ["serverless", "serverless"],

    # =========================
    # Programming Languages
    # =========================
    ["python", "python", "py"],
    ["java", "java", "core java"],
    ["c", "c", "c language"],
    ["cpp", "c++", "cpp"],
    ["csharp", "c#", "c sharp", "c-sharp"],
    ["go", "go", "golang"],
    ["rust", "rust"],
    ["php", "php"],
    ["ruby", "ruby", "ruby on rails"],
    ["kotlin", "kotlin"],
    ["swift", "swift"],
    ["bash", "bash", "shell scripting"],
    ["powershell", "powershell"],

    # =========================
    # Databases
    # =========================
    ["sql", "sql"],
    ["mysql", "mysql"],
    ["postgresql", "postgresql", "postgres"],
    ["oracle", "oracle", "oracle db"],
    ["sqlite", "sqlite"],
    ["mongodb", "mongodb", "mongo"],
    ["redis", "redis"],
    ["cassandra", "cassandra"],
    ["dynamodb", "dynamodb"],
    ["elasticsearch", "elasticsearch", "elastic search"],
    ["firebase", "firebase"],
    ["neo4j", "neo4j", "graph database"],

    # =========================
    # CS Fundamentals
    # =========================
    ["data_structures", "data structures", "ds"],
    ["algorithms", "algorithms", "algo"],
    ["oop", "oop", "oops", "object oriented programming"],
    ["functional_programming", "functional programming"],
    ["operating_systems", "operating systems", "os"],
    ["computer_networks", "computer networks", "cn"],
    ["dbms", "dbms", "database management systems"],
    ["system_design", "system design"],
    ["low_level_design", "lld"],
    ["high_level_design", "hld"],

    # =========================
    # AI / ML / Data
    # =========================
    ["machine_learning", "machine learning", "ml"],
    ["deep_learning", "deep learning", "dl"],
    ["artificial_intelligence", "artificial intelligence", "ai"],
    ["nlp", "nlp", "natural language processing"],
    ["computer_vision", "computer vision", "cv"],
    ["data_science", "data science"],
    ["data_analysis", "data analysis"],
    ["reinforcement_learning", "reinforcement learning", "rl"],
    ["tensorflow", "tensorflow"],
    ["keras", "keras"],
    ["pytorch", "pytorch"],
    ["scikit_learn", "scikit learn", "sklearn"],
    ["pandas", "pandas"],
    ["numpy", "numpy"],
    ["matplotlib", "matplotlib"],
    ["seaborn", "seaborn"],
    ["mlops", "mlops"],

    # =========================
    # DevOps / Cloud
    # =========================
    ["git", "git", "version control"],
    ["github_actions", "github actions"],
    ["ci_cd", "ci/cd", "continuous integration", "continuous deployment"],
    ["docker", "docker", "docker container"],
    ["kubernetes", "kubernetes", "k8s"],
    ["aws", "aws", "amazon web services"],
    ["azure", "azure", "microsoft azure"],
    ["gcp", "gcp", "google cloud platform"],
    ["terraform", "terraform"],
    ["ansible", "ansible"],
    ["jenkins", "jenkins"],

    # =========================
    # Testing / Quality
    # =========================
    ["unit_testing", "unit testing"],
    ["integration_testing", "integration testing"],
    ["selenium", "selenium"],
    ["jest", "jest"],
    ["pytest", "pytest"],
    ["cypress", "cypress"],

    # =========================
    # Security
    # =========================
    ["authentication", "authentication"],
    ["authorization", "authorization"],
    ["jwt", "jwt", "json web token"],
    ["oauth", "oauth", "oauth2"],
    ["encryption", "encryption"],
    ["web_security", "web security"],

    # =========================
    # Architecture / Patterns
    # =========================
    ["mvc", "mvc", "model view controller"],
    ["mvvm", "mvvm"],
    ["design_patterns", "design patterns"],
    ["event_driven_architecture", "event driven architecture"],
]


def clean(s: str) -> str:
    if not s:
        return ""
    return re.sub(r"[^a-z0-9]", "", s.lower()).strip()


def add_synonyms() -> None:
    for group in TO_STORE:
        canonical = clean(group[0])
        for skill in group:
            SKILL_MAP[clean(skill)] = canonical


def normalize_skill(skill: str) -> str:
    if not skill:
        return ""
    cleaned = clean(skill)
    return SKILL_MAP.get(cleaned, cleaned)


def normalize_skill_set(skills: List[str]) -> Set[str]:
    result = set()
    if not skills:
        return result
    for s in skills:
        if s is None:
            continue
        # skills could come as phrases; split on commas if present
        parts = [p.strip() for p in re.split(r",|;", s) if p.strip()]
        for p in parts:
            norm = normalize_skill(p)
            if norm:
                result.add(norm)
    return result


def skill_score(user_skills: Set[str], required_skills: Set[str]) -> int:
    if not required_skills:
        return 0
    matched = 0
    for s in required_skills:
        if s in user_skills:
            matched += 1
    score = (matched / len(required_skills)) * 100
    return round(score)


def experience_score(user_experience: int, required_experience: int) -> int:
    if required_experience <= 0 or user_experience >= required_experience:
        return 100
    # allow fractional ratio
    score = (user_experience / required_experience) * 100
    return int(score)


def role_score(job_role: str, prev_role: str) -> int:
    if not job_role or not prev_role:
        return 0
    return 100 if clean(job_role) == clean(prev_role) else 0


def ATSScore(user_skills: Set[str], required_skills: Set[str], user_exp_years: int,
             required_exp_years: int, job_role: str, prev_role: str) -> int:
    sk = skill_score(user_skills, required_skills)
    exp = experience_score(user_exp_years, required_exp_years)
    role_bonus = role_score(job_role, prev_role)

    final = (0.60 * sk) + (0.25 * exp) + (0.10 * role_bonus)
    return int(round(min(final, 100)))


def compute_from_parsed(parsed: dict, required_skills_input: List[str] = None,
                        user_experience: int = 0, required_experience: int = 0,
                        job_role: str = None, prev_role: str = None) -> dict:
    """
    Compute ATS score from parsed resume JSON.

    - `parsed` is the JSON object returned by your AI parser (expects `keywords` key).
    - `required_skills_input` is a list of required skill strings for the job.
    - Returns a dict with normalized sets and final `ats_score`.
    """
    add_synonyms()

    # Extract user skills from parsed JSON `keywords` field
    user_keywords = parsed.get("keywords") or []
    # Some parsers return keywords as list of strings
    if isinstance(user_keywords, list):
        user_skills_set = normalize_skill_set(user_keywords)
    else:
        # if string
        user_skills_set = normalize_skill_set([user_keywords])

    # Prepare required skills
    if required_skills_input is None:
        required_skills_input = []
    required_set = normalize_skill_set(required_skills_input)

    ats = ATSScore(user_skills_set, required_set, user_experience,
                   required_experience, job_role or "", prev_role or "")

    return {
        "user_skills_normalized": sorted(user_skills_set),
        "required_skills_normalized": sorted(required_set),
        "ats_score": ats,
    }


def extract_skills_from_text(text: str) -> List[str]:
    """Find known skills in free-form JD text by matching synonyms.

    Returns a list of canonical skill strings (may contain duplicates removed).
    """
    if not text:
        return []
    add_synonyms()
    cleaned = text.lower()
    found = set()
    # check longer synonyms first by sorting keys by length desc
    for syn in sorted(SKILL_MAP.keys(), key=lambda k: -len(k)):
        # match whole words in cleaned text
        if re.search(r"\b" + re.escape(syn) + r"\b", cleaned):
            found.add(SKILL_MAP[syn])
    return sorted(found)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Compute ATS score from parsed resume JSON")
    parser.add_argument("json_file", help="Path to parsed resume JSON file")
    parser.add_argument("--required", help="Comma-separated required skills", default="")
    parser.add_argument("--user-exp", type=int, help="User experience years", default=0)
    parser.add_argument("--required-exp", type=int, help="Required experience years", default=0)
    parser.add_argument("--job-role", help="Job role title", default="")
    parser.add_argument("--prev-role", help="Candidate previous role", default="")

    args = parser.parse_args()

    with open(args.json_file, 'r', encoding='utf-8') as fh:
        parsed = json.load(fh)

    required_skills = [s.strip() for s in re.split(r",|;", args.required) if s.strip()]

    out = compute_from_parsed(parsed, required_skills, args.user_exp, args.required_exp, args.job_role, args.prev_role)
    print(json.dumps(out, indent=2))
