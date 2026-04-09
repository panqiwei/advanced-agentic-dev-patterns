---
title: "The Elements of Operating-System Style"
author: "Eric S. Raymond"
published: 2003-09-19
domain: catb.org
url: http://www.catb.org/esr/writings/taoup/html/ch03s01.html
clipped: 2026-04-09
---

# The Elements of Operating-System Style

*From "The Art of Unix Programming", Chapter 3: Contrasts*

Before we can start discussing specific operating systems, we'll need an organizing framework for the ways that operating-system design can affect programming style for good or ill.

Overall, the design and programming styles associated with different operating systems seem to derive from three different sources: (a) the intentions of the operating-system designers, (b) uniformities forced on designs by costs and limitations in the programming environment, and (c) random cultural drift, early practices becoming traditional simply because they were there first.

Even if we take it as given that there is some random cultural drift in every operating-system community, considering the intentions of the designers and the costs and limitations of the results does reveal some interesting patterns that can help us understand the Unix style better by contrast. We can make the patterns explicit by analyzing some of the most important ways that operating systems differ.

### What Is the Operating System's Unifying Idea?

Unix has a couple of unifying ideas or metaphors that shape its APIs and the development style that proceeds from them. The most important of these are probably the "everything is a file" model and the pipe metaphor built on top of it. In general, development style under any given operating system is strongly conditioned by the unifying ideas baked into the system by its designers --- they percolate upwards into applications programming from the models provided by system tools and APIs.

Accordingly, the most basic question to ask in contrasting Unix with another operating system is: Does it have unifying ideas that shape its development, and if so how do they differ from Unix's?

To design the perfect anti-Unix, have no unifying idea at all, just an incoherent pile of ad-hoc features.

### Multitasking Capability

One of the most basic ways operating systems can differ is in the extent to which they can support multiple concurrent processes. At the lowest end (such as DOS or CP/M) the operating system is basically a sequential program loader with no capacity to multitask at all. Operating systems of this kind are no longer competitive on general-purpose computers.

At the next level up, an operating system may have *cooperative multitasking*. Such systems can support multiple processes, but a process has to voluntarily give up its hold on the processor before the next one can run (thus, simple programming errors can readily freeze the machine). This style of operating system was a transient adaptation to hardware that was powerful enough for concurrency but lacked either a periodic clock interrupt or a memory-management unit or both; it, too, is obsolete and no longer competitive.

Unix has *preemptive multitasking*, in which timeslices are allocated by a scheduler which routinely interrupts or pre-empts the running process in order to hand control to the next one. Almost all modern operating systems support preemption.

Note that "multitasking" is not the same as "multiuser". An operating system can be multitasking but single-user, in which case the facility is used to support a single console and multiple background processes. True multiuser support requires multiple user privilege domains, a feature we'll cover in the discussion of internal boundaries a bit further on.

To design the perfect anti-Unix, don't support multitasking at all --- or, support multitasking but cripple it by surrounding process management with a lot of restrictions, limitations, and special cases that mean it's quite difficult to get any actual use out of multitasking.

### Cooperating Processes

In the Unix experience, inexpensive process-spawning and easy inter-process communication (IPC) makes a whole ecology of small tools, pipes, and filters possible. We'll explore this ecology in Chapter 7; here, we need to point out some consequences of expensive process-spawning and IPC.

> The pipe was technically trivial, but profound in its effect. However, it would not have been trivial without the fundamental unifying notion of the process as an autonomous unit of computation, with process control being programmable. As in Multics, a shell was just another process; process control did not come from God inscribed in JCL.
>
> --- Doug McIlroy

If an operating system makes spawning new processes expensive and/or process control is difficult and inflexible, you'll usually see all of the following consequences:

- Monster monoliths become a more natural way of programming.
- Lots of policy has to be expressed within those monoliths. This encourages C++ and elaborately layered internal code organization, rather than C and relatively flat internal hierarchies.
- When processes can't avoid a need to communicate, they do so through mechanisms that are either clumsy, inefficient, and insecure (such as temporary files) or by knowing far too much about each others' implementations.
- Multithreading is extensively used for tasks that Unix would handle with multiple communicating lightweight processes.
- Learning and using asynchronous I/O is a must.

These are examples of common stylistic traits (even in applications programming) being driven by a limitation in the OS environment.

A subtle but important property of pipes and the other classic Unix IPC methods is that they require communication between programs to be held down to a level of simplicity that encourages separation of function. Conversely, the result of having no equivalent of the pipe is that programs can only be designed to cooperate by building in full knowledge of each others' internals.

In operating systems without flexible IPC and a strong tradition of using it, programs communicate by sharing elaborate data structures. Because the communication problem has to be solved anew for all programs every time another is added to the set, the complexity of this solution rises as the square of the number of cooperating programs. Worse than that, any change in one of the exposed data structures can induce subtle bugs in an arbitrarily large number of other programs.

> Word and Excel and PowerPoint and other Microsoft programs have intimate --- one might say promiscuous --- knowledge of each others' internals. In Unix, one tries to design programs to operate not specifically with each other, but with programs as yet unthought of.
>
> --- Ken Thompson

To design the perfect anti-Unix, make process-spawning very expensive, make process control difficult and inflexible, and leave IPC as an unsupported or half-supported afterthought.

### Internal Boundaries

Unix has wired into it an assumption that the programmer knows best. It doesn't stop you or request confirmation when you do dangerous things with your own data, like issuing `rm -rf *`. On the other hand, Unix is rather careful about not letting you step on other people's data. In fact, Unix encourages you to have multiple accounts, each with its own attached and possibly differing privileges, to help you protect yourself from misbehaving programs. System programs often have their own pseudo-user accounts to confer access to special system files without requiring unlimited (or *superuser*) access.

Unix has at least three levels of internal boundaries that guard against malicious users or buggy programs. One is memory management; Unix uses its hardware's memory management unit (MMU) to ensure that separate processes are prevented from intruding on the others' memory-address spaces. A second is the presence of true privilege groups for multiple users --- an ordinary (nonroot) user's processes cannot alter or read another user's files without permission. A third is the confinement of security-critical functions to the smallest possible pieces of trusted code. Under Unix, even the shell (the system command interpreter) is not a privileged program.

The strength of an operating system's internal boundaries is not merely an abstract issue of design: It has important practical consequences for the security of the system.

To design the perfect anti-Unix, discard or bypass memory management so that a runaway process can crash, subvert, or corrupt any running program. Have weak or nonexistent privilege groups, so users can readily alter each others' files and the system's critical data (e.g., a macro virus, having seized control of your word processor, can format your hard drive). And trust large volumes of code, like the entire shell and GUI, so that any bug or successful attack on that code becomes a threat to the entire system.

### File Attributes and Record Structures

Unix files have neither record structure nor attributes. In some operating systems, files have an associated record structure; the operating system (or its service libraries) knows about files with a fixed record length, or about text line termination and whether CR/LF is to be read as a single logical character.

In other operating systems, files and directories can have name/attribute pairs associated with them --- out-of-band data used (for example) to associate a document file with an application that understands it. (The classic Unix way to handle these associations is to have applications recognize 'magic numbers', or other type data within the file itself.)

OS-level record structures are generally an optimization hack, and do little more than complicate APIs and programmers' lives. They encourage the use of opaque record-oriented file formats that generic tools like text editors cannot read properly.

File attributes can be useful, but can raise some awkward semantic issues in a world of byte-stream-oriented tools and pipes. When file attributes are supported at the operating-system level, they predispose programmers to use opaque formats and lean on the file attributes to tie them to the specific applications that interpret them.

To design the perfect anti-Unix, have a cumbersome set of record structures that make it a hit-or-miss proposition whether any given tool will be able to even read a file as the writer intended it. Add file attributes and have the system depend on them heavily, so that the semantics of a file will not be determinable by looking at the data within it.

### Binary File Formats

If your operating system uses binary formats for critical data (such as user-account records) it is likely that no tradition of readable textual formats for applications will develop. For now it's sufficient to note the following consequences:

- Even if a command-line interface, scripting, and pipes are supported, very few filters will evolve.
- Data files will be accessible only through dedicated tools. Developers will think of the tools rather than the data files as central. Thus, different versions of file formats will tend to be incompatible.

To design the perfect anti-Unix, make all file formats binary and opaque, and require heavyweight tools to read and edit them.

### Preferred User Interface Style

Which kind of interface --- *command-line interfaces* (CLIs) or *graphical user interfaces* (GUIs) --- an operating system's designers choose as its normal mode of presentation will affect many aspects of the design, from process scheduling and memory management on up to the *application programming interfaces* (APIs) presented for applications to use.

It has been enough years since the first Macintosh that very few people need to be convinced that weak GUI facilities in an operating system are a problem. The Unix lesson is the opposite: that weak CLI facilities are a less obvious but equally severe deficit.

If the CLI facilities of an operating system are weak or nonexistent, you'll also see the following consequences:

- Programs will not be designed to cooperate with each other in unexpected ways --- because they *can't* be. Outputs aren't usable as inputs.
- Remote system administration will be sparsely supported, more difficult to use, and more network-intensive.
- Even simple noninteractive programs will incur the overhead of a GUI or elaborate scripting interface.
- Servers, daemons, and background processes will probably be impossible or at least rather difficult, to program in any graceful way.

To design the perfect anti-Unix, have no CLI and no capability to script programs --- or, important facilities that the CLI cannot drive.

### Intended Audience

The design of operating systems varies in response to the expected audience for the system. Some operating systems are intended for back rooms, some for desktops. Some are designed for technical users, others for end users. Some are intended to work standalone in real-time control applications, others for an environment of timesharing and pervasive networking.

One important distinction is client vs. server. 'Client' translates as: being lightweight, supporting only a single user, able to run on small machines, designed to be switched on when needed and off when the user is done, lacking pre-emptive multitasking, optimized for low latency, and putting a lot of its resources into fancy user interfaces. 'Server' translates as: being heavyweight, capable of running continuously, optimized for throughput, fully pre-emptively multitasking to handle multiple sessions. In origin all operating systems were server operating systems; the concept of a client operating system only emerged in the late 1970s with inexpensive but underpowered PC hardware. Client operating systems are more focused on a visually attractive user experience than on 24/7 uptime.

All these variables have an effect on development style. One of the most obvious is the level of interface complexity the target audience will tolerate, and how it tends to weight perceived complexity against other variables like cost and capability. Unix is often said to have been written by programmers for programmers --- an audience that is notoriously tolerant of interface complexity.

> This is a consequence rather than a goal. I abhor a system designed for the "user", if that word is a coded pejorative meaning "stupid and unsophisticated".
>
> --- Ken Thompson

To design the perfect anti-Unix, write an operating system that thinks it knows what you're doing better than you do. And then adds injury to insult by getting it wrong.

### Entry Barriers to Development

Another important dimension along which operating systems differ is the height of the barrier that separates mere users from becoming developers. There are two important cost drivers here. One is the monetary cost of development tools, the other is the time cost of gaining proficiency as a developer. Some development cultures evolve social barriers to entry, but these are usually an effect of the underlying technology costs, not a primary cause.

Expensive development tools and complex, opaque APIs produce small and elitist programming cultures. In those cultures, programming projects are large, serious endeavors --- they have to be in order to offer a payoff that justifies the cost of both hard and soft (human) capital invested. Large, serious projects tend to produce large, serious programs (and, far too often, large expensive failures).

Inexpensive tools and simple interfaces support casual programming, hobbyist cultures, and exploration. Programming projects can be small (often, formal project structure is plain unnecessary), and failure is not a catastrophe. This changes the style in which people develop code; among other things, they show less tendency to over-commit to failed approaches.

Casual programming tends to produce lots of small programs and a self-reinforcing, expanding community of knowledge. In a world of cheap hardware, the presence or absence of such a community is an increasingly important factor in whether an operating system is long-term viable at all.

Unix pioneered casual programming. One of the things Unix was first at doing was shipping with a compiler and scripting tools as part of the default installation available to all users, supporting a hobbyist software-development culture that spanned multiple installations. Many people who write code under Unix do not think of it as writing code --- they think of it as writing scripts to automate common tasks, or as customizing their environment.

To design the perfect anti-Unix, make casual programming impossible.
