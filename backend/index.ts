import Express, {
  response,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { db } from "./db/db";
import { EnergyDTO, type EnergyType } from "./types/energy";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "./generated/prisma/client";
import { QueryRequest } from "./types/queryReqeust";
import z, { ZodError } from "zod";
import type { DefaultArgs } from "@prisma/client/runtime/client";
import cors from "cors";
import type { TableDataResponse } from "./types/CommonDataResponse";
import { average } from "./helper/avg";

const app = Express();


// Enable CORS with specific options
app.use(cors());
app.use(Express.json());

app.use(Express.urlencoded({ extended: true }));

app.get("/health", async (req: Request, res: Response) => {
  const data = await db.user.findMany();
  res.json(data);
});

app.post("/energy", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const request = await EnergyDTO.parseAsync(body);
    let payload = {
      measureId: uuidv4(),
      current: request.current,
      power: request.power,
      voltage: request.voltage,
      createdTime: new Date(),
    };

    console.log(payload);
    const result = await db.measurement_log.create({ data: payload });

    if (!result) res.status(400);
    res.status(201).json(result);
  } catch {}
});

app.get("/energy", async (req: Request, res: Response) => {
  try {
    console.log("HIT");
    const request = QueryRequest.parse(req.query);

    const args: Prisma.measurement_logFindManyArgs = {};
    if (request.startDate && request.endDate) {
      args.where = {
        createdTime: {
          gte: new Date(request.startDate),
          lte: new Date(request.endDate),
        },
      };
    }
    args.orderBy = { createdTime: "desc" };
    const totalRow = await db.measurement_log.count({ where: args.where });

    if (request.limit != null && request.offset != null) {
      args.take = request.limit;
      args.skip = request.offset * request.limit;
    }

    const responseRows = await db.measurement_log.findMany(args);

    const response: TableDataResponse<EnergyType> = {
      rows: responseRows,
      totalRow: totalRow,
    };

    return res.json(response);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json(err.issues);
    }

    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/energy/summary", async (req: Request, res: Response) => {
  try {
    const request = QueryRequest.parse(req.query);

    const args: Prisma.measurement_logFindManyArgs = {};
    if (request.startDate && request.endDate) {
      args.where = {
        createdTime: {
          gte: new Date(request.startDate),
          lte: new Date(request.endDate),
        },
      };
    }
    args.orderBy = { createdTime: "desc" };

    if (request.limit != null && request.offset != null) {
      args.take = request.limit;
      args.skip = request.offset * request.limit;
    }

    const responseRows = await db.measurement_log.findMany(args);
    const rows = responseRows;

    const response = {
      voltage: average(rows, (r) => r.voltage),
      current: average(rows, (r) => r.current),
      power: average(rows, (r) => r.power),
    };

    return res.json(response);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json(err.issues);
    }

    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/sse/energy", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  try {
    const intervalId = setInterval(async () => {
      const request = QueryRequest.parse(req.query);

      const args: Prisma.measurement_logFindManyArgs = {};
      if (request.startDate && request.endDate) {
        args.where = {
          createdTime: {
            gte: new Date(request.startDate),
            lte: new Date(request.endDate),
          },
        };
      }
      args.orderBy = { createdTime: "desc" };

      if (request.limit != null && request.offset != null) {
        args.take = request.limit;
        args.skip = request.offset * request.limit;
      }

      const responseRows = await db.measurement_log.findMany(args);
      const rows = responseRows;

      const response = {
        voltage: average(rows, (r) => r.voltage),
        current: average(rows, (r) => r.current),
        power: average(rows, (r) => r.power),
      };

      res.write(`data: ${JSON.stringify(response)}\n\n`);
    }, 2000);
    req.on("close", () => {
      clearInterval(intervalId);
      res.end();
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json(err.issues);
    }

    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on http://0.0.0.0:3000");
});
