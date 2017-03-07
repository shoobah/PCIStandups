# Programming Case – Pizza Cabin Inc.
The restaurant chain Pizza Cabin Inc. (PCI) has grown a lot recently. Now they are so big that they have some 850 people, known as Pizza Experts, taking pizza orders via phone. To create optimal schedules for their Pizza Experts they use a state-of-the-art workforce management (WFM) system. This system takes into account the demand for service and schedule start, end, break and lunch times accordingly.

The Pizza Experts are divided into teams of 8 to 16 people, and each team has a team leader. The team leaders are responsible for daily coaching, absence reporting, etc. To accomplish this they have a need to schedule a 15-minute stand-up meeting with the team every day. It is not necessary that all Pizza Experts are present, but different team leaders have different preferences on how many.

The problem is to find a time slot when there is enough people at work and not on break (lunch or just a short break). The WFM system can’t do this for them. However, there is a REST API that can provide a json object for the team’s schedule for each day*.

To find a solution to this, PCI has decided to engage one lonely consultant (guess who?). As a first step PCI wants a tool that based on the json object returned from the REST service, and an input on how many team members need to be present at the meeting, can find all suitable 15-minute intervals (possible start times are 00, 15, 30 and 45) for the daily stand-up.

*) See  [example data](http://pizzacabininc.azurewebsites.net/PizzaCabinInc.svc/schedule/2015-12-14) for an example.