import StatisticsModel from "../models/Statistics.js";


export async function createStatistics(weekData, userId) {
    try {
        const doc = new StatisticsModel({
            weekData,
            lastWeekCreated: 0,
            lastWeekFulfilled: 0,
            lastWeekDeleted: 0,
            mostCreated: [0, 0, 0, 0, 0, 0, 0],
            mostDeleted: [0, 0, 0, 0, 0, 0, 0],
            user: userId
        })
        const {_doc} = await doc.save()
        return _doc
    } catch (err) {
        return err
    }
}

export async function checkStatistics(req, res) {
    try {
        let statistics = await StatisticsModel.findOne({user: `${req.userId}`})
        if (req.body.weekData > statistics.weekData) {
            statistics = await StatisticsModel.findOneAndUpdate(
                {user: `${req.userId}`},
                {
                    weekData: req.body.weekData,
                    lastWeekCreated: 0,
                    lastWeekFulfilled: 0,
                    lastWeekDeleted: 0,
                },
                {returnDocument: "after"}
            )
        }
        res.json(statistics)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить сатистику'
        })
    }
}


export async function taskWeekCreatedUpdate(weekData, userId, weekDay, value) {
    let statistics = await StatisticsModel.findOne({user: `${userId}`})
    statistics.mostCreated[weekDay] += value
    let finalStatistics = {};
    if (weekData > statistics.weekData) {
        finalStatistics = {
            weekData,
            lastWeekCreated: value,
            lastWeekFulfilled: 0,
            lastWeekDeleted: 0,
        }
    } else {
        finalStatistics = {
            lastWeekCreated: statistics.lastWeekCreated + value,
        }
    }

    const {_doc} = await StatisticsModel.findOneAndUpdate(
        {user: userId},
        {
            ...finalStatistics,
            mostCreated: statistics.mostCreated
        },
        {returnDocument: "after"}
    )
    return _doc
}

export async function taskWeekFulfilledUpdate(weekData, userId, weekDay, value) {
    let statistics = await StatisticsModel.findOne({user: `${userId}`})
    statistics.mostFulfilled[weekDay] += value
    let finalStatistics = {};
    if (weekData > statistics.weekData) {
        finalStatistics = {
            weekData,
            lastWeekCreated: 0,
            lastWeekFulfilled: value,
            lastWeekDeleted: 0,
        }
    } else {
        finalStatistics = {
            lastWeekFulfilled: statistics.lastWeekFulfilled + value,
        }
    }

    const {_doc} = await StatisticsModel.findOneAndUpdate(
        {user: userId},
        {
            ...finalStatistics,
            mostFulfilled: statistics.mostFulfilled
        },
        {returnDocument: "after"}
    )
    return _doc
}



export async function taskWeekDeletedUpdate(weekData, userId, value) {
    let statistics = await StatisticsModel.findOne({user: `${userId}`})
    let finalStatistics = {};
    if (weekData > statistics.weekData) {
        finalStatistics = {
            weekData,
            lastWeekCreated: 0,
            lastWeekFulfilled: 0,
            lastWeekDeleted: value,
        }
    } else {
        finalStatistics = {
            lastWeekDeleted: statistics.lastWeekDeleted + value,
        }
    }

    const {_doc} = await StatisticsModel.findOneAndUpdate(
        {user: userId},
        {...finalStatistics},
        {returnDocument: "after"}
    )
    return _doc
}






