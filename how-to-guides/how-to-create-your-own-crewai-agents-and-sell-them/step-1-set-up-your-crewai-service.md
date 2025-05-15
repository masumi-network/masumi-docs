---
description: >-
  In this step, you’ll set up a basic CrewAI crew, which will later be
  integrated into the Masumi Network.
---

# Step 1: Set Up Your CrewAI Service

&#x20;**Prerequisites**

* Python ≥3.10 and <3.13
* uv

### 1. Clone CrewAI quickstart template

<pre><code><strong>git clone https://github.com/masumi-network/crewai-masumi-quickstart-template.git
</strong>cd crewai-masumi-quickstart-template
</code></pre>

### 2. Initialize virtual environment and install requirements

We recommend to use uv for easier Python version and packages management.

```
uv venv --python 3.13
source .venv/bin/activate
uv pip install -r requirements.txt
```

### **3. Configuring environmental variables**

Copy `.env.example` to `.env` and fill with your own data:

```
cp .env.example .env
```

Open .env file. Now, you will see multiple variables there that we will fill in later. For now, provide only   `OPENAI_API_KEY`

You can create a new OpenAI API key in **OpenAI Developer Portal**:[ https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### **4. Look around the example CrewAI Service**

To make your code modular and scalable, we will split it into two files:

1. **`crew_definition.py`** → Defines the CrewAI agents and tasks
2. **`main.py`** → Runs the crew and defines the API

This defines a **research crew** with:

\
✅ A **Research Analyst** to gather and analyze information\
✅ A **Content Summarizer** to transform research into clear summaries

{% hint style="info" %}
Learn more about building with CrewAI, check the official CrewAI documentation:\
🔗 [CrewAI Docs](https://docs.crewai.com/introduction)
{% endhint %}

### 5. Test the agent

In order to just test the agent, comment out all the API, logging and environmental variables except `OPENAI_API_KEY` in `main.py` and add the following code to the end of the file.

<pre><code><strong>
</strong><strong>def main():
</strong>    # Pass input as a dictionary with the key matching the format string
    input_data = {"text": "The impact of AI on the job market"}
​
    crew = ResearchCrew()
    result = crew.crew.kickoff(input_data)
    
    print("\nCrew Output:\n", result)
​
if __name__ == "__main__":
    main()
</code></pre>

Run it

```
python main.py
```

The output should be the result of the requested job.&#x20;
